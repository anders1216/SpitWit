import React, { Component } from 'react'
import NewPlayerForm from './forms/NewPlayerForm'
import Player from './Player'
import { GameContext } from '../containers/Game'

class Lobby extends Component {
	render() {
		const { currPlayer, game, players } = this.props

		return (
			<div>
				<h1>Room Code: {game.room_code}</h1>
				{players.length === 8 && <h2>This game has reached max player capacity.</h2>}
				{currPlayer ? (
					<React.Fragment>
						{players.map((player, i) => <Player key={i} i={players.indexOf(player)} {...player} />)}
						{currPlayer.is_host && (
							<button
								title='aleast 3 players required to start game.'
								onClick={this.props.handleStartGame}
								disabled={players.length < 3}>
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
