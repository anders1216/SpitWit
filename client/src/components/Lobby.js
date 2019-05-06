import React, { Component } from 'react'
import NewPlayerForm from './forms/NewPlayerForm'
import Player from './Player'
import { GameContext } from '../containers/Game'

class Lobby extends Component {
	render() {
		const { currPlayer, game, players } = this.props
		console.log(players)

		return (
			<div>
				{currPlayer ? (
					<React.Fragment>
						{players.map((player) => <Player {...player} />)}
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
