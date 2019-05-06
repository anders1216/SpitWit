import React, { Component } from 'react'
import NewPlayerForm from './forms/NewPlayerForm'
import Player from './Player'

class Lobby extends Component {
	renderJoinedPlayers() {
		return <div>{this.state.players.map((player) => <Player {...player} />)}</div>
	}

	render() {
		const { currPlayer } = this.context

		return (
			<div>{currPlayer ? this.renderJoinedPlayers : <NewPlayerForm handleSubmit={this.setCurrentPlayer} />}</div>
		)
	}
}

export default Lobby
