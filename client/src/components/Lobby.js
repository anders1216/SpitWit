import React, { Component } from 'react'
import NewPlayerForm from './forms/NewPlayerForm'
import Player from './Player'
import { GameContext } from '../containers/Game'

class Lobby extends Component {
	renderPlayers() {
		const { currPlayer, players } = this.props
		const isHost = currPlayer && currPlayer.is_host

		return (
			<React.Fragment>
				{players.map((player, i) => <Player key={i} i={players.indexOf(player)} {...player} />)}
				{isHost && (
					<button
						onClick={this.props.handleStartGame}
						style={players.length < 3 ? { opacity: 0.5 } : {}}
						disabled={players.length < 3}>
						Start Game
					</button>
				)}
				<br />
				<br />
				{currPlayer &&
					(players.length < 3 && isHost ? (
						<p>
							<small>You need at least 3 players to start the game.</small>
						</p>
					) : (
						<p>
							<small>Waiting for host to start the game...</small>
						</p>
					))}
			</React.Fragment>
		)
	}

	render() {
		const { currPlayer, players, game, handleBackToMainMenu } = this.props

		return (
			<div>
				<br />
				<h1>Room Code: {game.room_code}</h1>
				<br />
				{players && this.renderPlayers()}
				{!currPlayer && <NewPlayerForm handleSubmit={this.props.handleSubmit} />}
				<br />
				<button onClick={handleBackToMainMenu}>Back to Main Menu</button>
			</div>
		)
	}
}

export default Lobby
