import React, { Component } from 'react'
import ActionCable from 'actioncable'

import Lobby from '../components/Lobby'
import AnswerForm from '../components/forms/AnswerForm'
import Round from './Round'
import Endgame from '../components/Endgame'

// This is the main component that handles subscriptions.
// The main communication is between the host's client and the server.
// The host's client will control any timers which are used to progress the game.
//
// During a game loop, the follow commuication of data occurs:
//   1. Server sends data for prompt and answers to display for current round
//   2. Host sends the timer to the server for voting mode, decrementing every second
//   3. Server updates the timer received from host until it reaches 0
//   4. When the timer hits 0, the server sends data to set voting mode off to display results
//   5. Host sends timer again for how long to display vote results
//   6. When the timer for post-voting hits 0, the server increments round and repeats loop
//
// The shape of the data being passed between host and server from the GamesChannel:
// {
//   timer: number,             # seconds remaining for this round
//   is_voting_phase: boolean,  # true if this voting round false if displaying vote results
//   round_number: number,      # current round number
//   player_prompts: object,    # array of objects mapping player id to assigned prompts
//                              # object that contains information for round
//	 prompt: string,
//   answers: [               # object that maps player to answer
//   ],
//   votes: [            # object that maps voter id to answerer id
//	 ]
// }
export const GameContext = React.createContext()

class Game extends Component {
	intervalId
	defaultState = {
		currPlayer: undefined,
		players: [],
		player_prompts: {},
		round_number: 0,
		is_voting_phase: false,
		timer: undefined,
		answers: [],
		votes: [],
		prompt: undefined,
		has_ended: false,
		best_answer: undefined,
		isMuted: false
	}
	state = this.defaultState

	// Start subscription after successfully joining game
	componentDidMount() {
		const { apiUrl, game, currPlayer } = this.props

		const cableUrl = apiUrl.replace(/(http)/g, 'ws') + 'cable'
		this.cable = ActionCable.createConsumer(cableUrl)

		// Game subscription
		this.gameSub = this.cable.subscriptions.create(
			{ channel: 'GamesChannel', game_id: game.id },
			{
				connected: () => console.log('connected to game.'),
				received: this.handleReceiveGameUpdate
			}
		)

		// Player subscription
		this.playerSub = this.cable.subscriptions.create(
			{ channel: 'PlayersChannel', game_id: game.id },
			{
				received: this.handleReceivePlayersUpdate
			}
		)

		// Get players currently in lobby
		this.getPlayersInLobby()

		this.isMobile = /Mobi|Android/i.test(navigator.userAgent)

		// Some mobile don't support HTML5 audio
		if (!this.isMobile) {
			// Play theme music
			this.music = new Audio('audio/sans_theme.mp3')
			this.music.loop = true
			this.music.volume = 0.4
			this.music.play()
		}
	}

	componentWillUnmount() {
		console.log('disconnected from game.')
		this.cable.subscriptions.remove(this.gameSub)
		this.cable.subscriptions.remove(this.playerSub)

		!this.isMobile && this.music && this.music.pause()
		clearInterval(this.intervalId)
		this.setState(this.defaultState)
		this.props.resetGame()
	}

	handleReceiveGameUpdate = (game) => {
		const {
			timer,
			answers,
			votes,
			prompt,
			round_number,
			player_prompts,
			is_voting_phase,
			has_ended,
			best_answer
			// test
		} = game

		// console.log(game)

		if (has_ended) {
			this.setState({ has_ended: has_ended, best_answer: best_answer })

			// Stop subscriptions on game end
			// this.cable.subscriptions.remove(this.gameSub)
			// this.cable.subscriptions.remove(this.playerSub)
		}

		if (round_number > 0 && is_voting_phase !== this.state.is_voting_phase) {
			const newTimer = is_voting_phase ? 12 : 5
			this.setState({
				timer: newTimer,
				is_voting_phase: is_voting_phase,
				prompt: '',
				answers: [],
				votes: []
			})

			this.state.currPlayer &&
				this.state.currPlayer.is_host &&
				this.gameSub.send({
					game_id: this.props.game.id,
					timer: newTimer,
					timeLimit: newTimer
				})
		}

		round_number && this.setState({ round_number: round_number })
		player_prompts && this.setState({ player_prompts: player_prompts })
		answers && this.setState({ answers })
		votes && this.setState({ votes })
		prompt && this.setState({ prompt })
		// test && this.setCountdown()

		timer !== undefined && this.setState({ timer })
	}

	handleReceivePlayersUpdate = (players) => {
		// Sort players by their id
		this.setState({ players: players.sort((p1, p2) => p1.id - p2.id) })
	}

	createNewPlayer = (playerName) => {
		const { is_host, game } = this.props
		// localStorage.setItem('currPlayer': player)

		fetch(this.props.apiUrl + 'players', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				name: playerName,
				game_id: game.id,
				score: 0,
				is_host: is_host
			})
		})
			.then((res) => res.json())
			.then((player) => {
				this.setState({ currPlayer: player })
				is_host && this.playerSub.send({ game_id: game.id, host_id: player.id })
			})
	}

	getPlayersInLobby = () => {
		if (!this.props.game) return

		fetch(this.props.apiUrl + `games/${this.props.game.id}/players`).then((res) => res.json()).then((players) => {
			this.setState({ players })
		})
	}

	setCountdown = () => {
		this.intervalId = setInterval(() => {
			this.gameSub.send({
				game_id: this.props.game.id,
				timer: this.state.timer - 1,
				is_voting_phase: this.state.is_voting_phase
			})
		}, 1000)
	}

	startGame = () => {
		const timeLimit = 90
		const { is_voting_phase } = this.state

		this.setState({ timer: timeLimit }, this.setCountdown)

		this.gameSub.send({
			game_id: this.props.game.id,
			timer: timeLimit,
			timeLimit: timeLimit,
			is_voting_phase: is_voting_phase
		})
	}

	createNewAnswer = (answer, num) => {
		const { currPlayer, player_prompts } = this.state
		const { apiUrl } = this.props

		fetch(apiUrl + 'answers', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				answer: {
					text: answer,
					player_id: currPlayer.id,
					round_id: player_prompts[currPlayer.id][num].round_id
				}
			})
		})
	}

	handleVote = (answer) => {
		fetch(this.props.apiUrl + 'votes', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				answer_id: answer.id,
				player_id: this.state.currPlayer.id
			})
		})
	}

	handleToggleMute = () => {
		const newVal = !this.state.isMuted
		this.setState({ isMuted: newVal })

		if (!this.isMobile) {
			if (!newVal) {
				this.music.play()
			} else {
				this.music.pause()
			}
		}
	}

	// Reset everything and go back to home
	handleBackToMainMenu = () => {
		this.setState(this.defaultState)
		this.props.resetGame()
	}

	// Reset everything but preserve current player
	handlePlayAgain = () => {
		const newState = this.defaultState
		newState['currPlayer'] = this.state.currPlayer
		this.setState(this.defaultState)
	}

	// RESET = () => {
	// 	this.gameSub.send({ RESET: true })
	// }

	// PAUSE = () => {
	// 	clearInterval(this.intervalId)
	// }

	render() {
		const {
			currPlayer,
			players,
			round_number,
			player_prompts,
			is_voting_phase,
			has_ended,
			answers,
			votes,
			prompt,
			isMuted,
			best_answer,
			timer
		} = this.state
		const { game } = this.props

		const hasGameEndedOnClientBeforeServer = !has_ended && round_number > Object.keys(player_prompts).length * 2

		// Conditionally render components based on the current state of the game.
		let GameComponent

		// Game ended but haven't recieved it from server yet so show loading
		if (hasGameEndedOnClientBeforeServer) {
			GameComponent = (
				<React.Fragment>
					<div className='loader'>
						🤔<br />
					</div>
					<p>Loading Scoreboard...</p>
				</React.Fragment>
			)
			// Game has ended, show final screen
		} else if (has_ended) {
			GameComponent = (
				<Endgame
					players={players}
					best_answer={best_answer}
					handleBackToMainMenu={this.handleBackToMainMenu}
					handlePlayAgain={this.handlePlayAgain}
				/>
			)
			// Game started, go to Answers Form
		} else if (round_number === 0) {
			// Prematurely unmount so that we can give the server time
			// to create the answers on unmount
			if (timer > 1 && Object.keys(player_prompts).length > 0) {
				GameComponent = (
					<AnswerForm
						handleSubmit={this.createNewAnswer}
						currPlayer={currPlayer}
						game={game}
						player_prompts={player_prompts}
					/>
				)
				// Show loading during delay to create answers
			} else if (timer > 0 && Object.keys(player_prompts).length > 0) {
				GameComponent = (
					<React.Fragment>
						<div className='loader'>
							🤔<br />
						</div>
						<p>Loading Rounds...</p>
					</React.Fragment>
				)

				// Show lobby before starting game / letting players join
			} else {
				GameComponent = (
					<Lobby
						handleStartGame={this.startGame}
						handleSubmit={this.createNewPlayer}
						handleBackToMainMenu={this.handleBackToMainMenu}
						players={players}
						currPlayer={currPlayer}
						game={game}
					/>
				)
			}
		} else if (prompt) {
			GameComponent = (
				<Round
					handleVote={this.handleVote}
					round_number={round_number}
					players={players}
					currPlayer={currPlayer}
					answers={answers}
					votes={votes}
					prompt={prompt}
					player_prompts={player_prompts}
					is_voting_phase={is_voting_phase}
					isMuted={isMuted || this.isMobile}
				/>
			)
		}

		return (
			<div className='game'>
				{!this.isMobile && (
					<span onClick={this.handleToggleMute} className='mute'>
						{isMuted ? '🔇' : '🔉'}
					</span>
				)}
				<h1>{this.state.timer > 0 && (!hasGameEndedOnClientBeforeServer && !has_ended) && this.state.timer}</h1>
				<br />
				{GameComponent}
				{/* <br />
				<button onClick={this.PAUSE}>PAUSE</button>
				<button onClick={this.RESET}>/!\ RESET /!\</button> */}
			</div>
		)
	}
}

export default Game
