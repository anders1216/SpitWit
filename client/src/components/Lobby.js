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
			<div>
				{currPlayer ? (
					<React.Fragment>
						{this.renderJoinedPlayers()}
						{currPlayer.isHost && <button onClick={this.props.handleStartGame}>Start Game</button>}
					</React.Fragment>
				) : (
					<NewPlayerForm handleSubmit={this.props.handleSubmit} />
				)}
			</div>
		)
	}
}

export default Lobby
