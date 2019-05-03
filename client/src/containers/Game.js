import React, { Component } from 'react'
import ActionCable from 'actioncable'
import Lobby from '../components/Lobby'
import Round from './Round'
import Player from '../components/Player'

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
		const cableUrl = this.props.apiUrl.replace(/[http|https]/g, 'ws') + '/cable'
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

	render() {
		const { currPlayer } = this.state
		return (
			<PlayerContext.Provider value={currPlayer}>
				{this.state.round_number === 0 ? <Lobby setCurrentPlayer={this.setCurrentPlayer} /> : <Round />}
			</PlayerContext.Provider>
		)
	}
}

export default Game
