import React, { Component } from 'react'
import ActionCable from 'actioncable'

import Lobby from '../components/Lobby'
import AnswerForm from '../components/forms/AnswerForm'
import Round from './Round'
import Player from '../components/Player'

// This is the main component that handles subscriptions
// The main communication is between the host's client and the server
// The host's client will control any timers which are used to progress the game
//
// The shape of the data being passed between host and server from the GamesChannel:
// {
//   timer: number             # seconds remaining for this round
//   is_voting_round: boolean  # true if this voting round false if displaying vote results
//   round_number: number      # current round number
//   prompt: string            # the prompt to display for this round
//   answers: {                # object that maps user to answer
//	   user1: answer1,
//     user2: answer2
//   }
// }

const PlayerContext = React.createContext()

class Game extends Component {
	state = {
		currPlayer: null,
		round_number: 0,
		timer: 0,
		players: []
	}

	// Start subscription after successfully joining game
	componentDidMount() {
		const cableUrl = this.props.apiUrl.replace(/(https|http)/g, 'ws') + '/cable'
		const cable = ActionCable.createConsumer(cableUrl)

		// Game subscription
		this.gameSub = cable.subscriptions.create('GamesChannel', {
			connected: () => console.log('connected to game.'),
			received: this.handleRecieveGameUpdate
		})

		// Player subscription
		this.playerSub = cable.subscriptions.create('PlayersChannel', {
			received: this.handleReceivePlayerUpdate
		})
	}

	componentWillUnmount() {
		console.log('disconnected from game.')
	}

	handleReceiveGameUpdate = (data) => {
		const { timer, prompt, answers, round_number } = data

		round_number && this.setState({ roundNumber: round_number })
	}

	handleReceivePlayerUpdate = (player) => {
		if (!this.state.players.includes(player)) {
			this.setState({ players: [ ...this.state.players, player ] })
		}
	}

	setCurrentPlayer = (player) => {
		// localStorage.setItem('currPlayer': player)
		this.setState({ currPlayer: player })
	}

	renderJoinedPlayers() {
		return <div>{this.state.players.map((player) => <Player {...player} />)}</div>
	}

	handleNewAnswer = (answer) => {
		let player_id = this.state.currentPlayer.id
		fetch('http://localhost:3000/answers', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ text: answer, player_id: player_id })
		})
	}

	render() {
		const { currPlayer } = this.state
		let GameComponent = null

		if (this.state.round_number === 0) {
			if (this.state.timer > 0) {
				GameComponent = <AnswerForm handleSubmit={this.handleNewAnswer} />
			}
			GameComponent = <Lobby handleSubmit={this.setCurrentPlayer} />
		} else {
			GameComponent = <Round />
		}

		return <PlayerContext.Provider value={currPlayer}>{GameComponent}</PlayerContext.Provider>
	}
}

export default Game
