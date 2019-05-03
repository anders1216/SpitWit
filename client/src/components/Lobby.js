import React, { Component } from 'react'
import NewPlayerForm from './forms/NewPlayerForm'
import Player from './Player'

const PlayerContext = React.createContext()

class Lobby extends Component {
	state = {
		currentPlayer: null,
		players: []
	}

	setCurrentPlayer = (player) => {
		this.setState({ currentPlayer: player })
	}

	renderJoinedPlayers() {
		return <div>{this.state.players.map((player) => <Player {...player} />)}</div>
	}

	render() {
		const { currentPlayer } = this.state
		return (
			<PlayerContext.Provider value={currentPlayer}>
				{currentPlayer ? this.renderJoinedPlayers : <NewPlayerForm />}
			</PlayerContext.Provider>
		)
	}
}
export default Lobby
