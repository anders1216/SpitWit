import React, { Component } from 'react'
import NewGameForm from './components/forms/NewGameForm'
import Game from './containers/Game'
import './App.css'

class App extends Component {
	API_URL = 'http://localhost:3000/' // 'https://damp-headland-59352.herokuapp.com/'

	state = {
		isHost: true,
		game: {
			id: 1,
			round_number: 0,
			room_code: 'TEST'
		}
	}

	handleEnterGame = (roomCode) => {
		fetch(this.API_URL + 'games').then((res) => res.json()).then((games) => {
			const game = games.find((game) => game.room_code === roomCode.toUpperCase())

			if (game) {
				this.setState({ game: game })
			}
		})
	}

	handleCreateNewGame = () => {
		fetch(this.API_URL + 'games', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((res) => res.json())
			.then((game) => this.setState({ game: game, isHost: true }))
	}

	// Randomize the emojis for more fun
	renderSpitWits = () => {
		let emojis = []
		for (let i = 0; i < 10; i++) {
			emojis.push([ '🧠', '🧠', '💦', '🤔', '🤔' ][Math.floor(Math.random() * 5)])
		}

		return (
			<div className='area'>
				<ul className='circles'>{emojis.map((emoji) => <li>{emoji}</li>)}</ul>
			</div>
		)
	}

	render() {
		const { game, isHost } = this.state

		return (
			<div className='App'>
				{game ? (
					<Game game={game} isHost={isHost} apiUrl={this.API_URL} />
				) : (
					<NewGameForm
						handleEnterGame={this.handleEnterGame}
						handleCreateNewGame={this.handleCreateNewGame}
					/>
				)}
				{this.renderSpitWits()}
			</div>
		)
	}
}

export default App
