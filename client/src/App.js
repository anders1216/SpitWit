import React, { Component } from 'react'
import NewGameForm from './components/forms/NewGameForm'
import Game from './containers/Game'
import './App.css'

class App extends Component {
	API_URL = 'http://localhost:3000/' // 'https://damp-headland-59352.herokuapp.com/'

	state = {
		isHost: false,
		game: undefined
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
				<ul className='circles'>{emojis.map((emoji, i) => <li key={i}>{emoji}</li>)}</ul>
			</div>
		)
	}

	render() {
		const { game, isHost } = this.state

		return (
			<div className='App'>
				{this.renderSpitWits()}
				{game ? (
					<Game game={game} isHost={isHost} apiUrl={this.API_URL} />
				) : (
					<div>
						<h1 className='heading'>SpitWit</h1>
						<NewGameForm
							handleEnterGame={this.handleEnterGame}
							handleCreateNewGame={this.handleCreateNewGame}
						/>
					</div>
				)}
			</div>
		)
	}
}

export default App
