import React, { Component } from 'react'
import ActionCable from 'actioncable'

import Lobby from '../components/Lobby'
import AnswerForm from '../components/forms/AnswerForm'
import Round from './Round'
import Player from '../components/Player'

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
//   timer: number             # seconds remaining for this round
//   is_voting_round: boolean  # true if this voting round false if displaying vote results
//   round_number: number      # current round number
//   prompt: string            # the prompt to display for this round
//   answers: {                # object that maps player to answer
//	   [player1Id]: string,
//     [player2Id]: string
//   },
//   votes: {                  # object that maps player id to votes
//	   [player1Id]: number,
//     [player2Id]: number
//   }
// }

export const GameContext = React.createContext()

class Game extends Component {
	state = {
		currPlayer: null,
		round_number: 0,
		timer: 0,
		players: []
	}

	// Start subscription after successfully joining game
	componentDidMount() {
		const cableUrl = this.props.apiUrl.replace(/(https|http)/g, 'ws') + 'cable'
		const cable = ActionCable.createConsumer(cableUrl)

		// Game subscription
		this.gameSub = cable.subscriptions.create('GamesChannel', {
			connected: () => console.log('connected to game.'),
			received: this.handleReceiveGameUpdate
		})

		// Player subscription
		this.playerSub = cable.subscriptions.create('PlayersChannel', {
			received: this.handleReceivePlayerUpdate
		})
	}
	// If the host leaves sends mesage to console. may update later to set an Alert that communicates to non host players the end of game.
	componentWillUnmount() {
		console.log('disconnected from game.')
	}

	//updating the round number as the game continues.
	handleReceiveGameUpdate = (data) => {
		const { timer, prompt, answers, round_number } = data

		round_number && this.setState({ roundNumber: round_number })
	}

	// Adding new players to players to the players array if they havent been added.
	handleReceivePlayerUpdate = (player) => {
		console.log('new player created')
		if (!this.state.players.includes(player)) {
			this.setState({ players: [ ...this.state.players, player ] })
		}
	}

	// Passed down to post new Player to the DB.
	createNewPlayer = (playerName) => {
		let is_host = this.props.isHost
		let game_id = this.props.game.id
		// localStorage.setItem('currPlayer': player)

		fetch(this.props.apiUrl + 'players', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				name: playerName,
				game_id: game_id,
				is_host: is_host
			})
		})
			.then((res) => res.json())
			.then((player) => {
				this.setState({ currPlayer: player })
			})
	}

	renderJoinedPlayers() {
		return <div>{this.state.players.map((player) => <Player {...player} />)}</div>
	}

	startGame() {
		const timer = { timer: 90 }
		this.setState(timer)
		this.gameSub.send(timer)
	}

	// passed down to post new anwers to the DB.
	handleNewAnswer = (answer) => {
		let player_id = this.state.currentPlayer.id
		fetch('http://localhost:3000/answers', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ text: answer, player_id: player_id })
		})
	}

	render() {
		//defining a varible to establish "context" based on all aspects of the context we intend to access later.
		const { currPlayer, players } = this.state
		const { game } = this.props

		//conditionally render components based on the current step of the game.
		let GameComponent
		//set a varaible to be rendered. if the game has started render the answer from, if not render the lobby if the answerforms have been rendered and passed and the timer reaches 0, initiating a round, render round 1.
		if (this.state.round_number === 0) {
			if (this.state.timer > 0) {
				GameComponent = <AnswerForm handleSubmit={this.handleNewAnswer} currPlayer={currPlayer} game={game} />
			} else {
				GameComponent = (
					<Lobby
						handleStartGame={this.startGame}
						handleSubmit={this.createNewPlayer}
						players={players}
						currPlayer={currPlayer}
						game={game}
					/>
				)
			}
		} else {
			GameComponent = <Round currPlayer={currPlayer} game={game} />
		}

		return (
			//render the variable thats been defined above.
			<div>{GameComponent}</div>
		)
	}
}

export default Game
