import React, { Component } from 'react'
import NewPlayerForm from './forms/NewPlayerForm'
import Player from './Player'
import { GameContext } from '../containers/Game'

class Lobby extends Component {
	render() {
		const { currPlayer, game, players } = this.props

		return (
			<div>
				<br />
				<h1>Room Code: {game.room_code}</h1>
				<br />
				{players.length === 8 && <h2>This game has reached max player capacity.</h2>}
				{currPlayer ? (
					<React.Fragment>
						{players.map((player, i) => <Player key={i} i={players.indexOf(player)} {...player} />)}
						{currPlayer.is_host && (
							<button
								onClick={this.props.handleStartGame}
								style={players.length < 3 ? { opacity: 0.5 } : {}}
								disabled={players.length < 3}>
								Start Game
							</button>
						)}
						<br />
						<br />
						{players.length < 3 &&
						currPlayer.is_host && (
							<p>
								<small>You need at least 3 players to start the game.</small>
							</p>
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
