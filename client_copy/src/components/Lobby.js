import React, { Component } from 'react'
import NewPlayerForm from './forms/NewPlayerForm'
import Player from './Player'
import { GameContext } from '../containers/Game'

class Lobby extends Component {
	render() {
		const { currPlayer, game, players } = this.props

		return (
			<div>
				{currPlayer ? (
					<React.Fragment>
						{players.map((player, i) => <Player key={i} i={players.indexOf(player)} {...player} />)}
						{currPlayer.is_host && (
							<button onClick={this.props.handleStartGame} disabled>
								Start Game
							</button>
						)}
					</React.Fragment>
				) : (
					<NewPlayerForm handleSubmit={this.props.handleSubmit} />
				)}
			</div>
		)
	}
}

export default Lobby