import React, { Component } from 'react'
import NewGameForm from './components/forms/NewGameForm'
import Game from './containers/Game'
import './App.css'

class App extends Component {
	API_URL = 'http://localhost:3000/'

	state = {
		hasValidGame: false
	}

	handleEnterGame = (roomCode) => {
		fetch(this.API_URL + 'games').then((res) => res.json()).then((games) => {
			if (games.some((game) => game.room_code === roomCode.toUpperCase())) {
				console.log('hi')
				this.setState({ hasValidGame: true })
			}
		})
	}

	handleCreateNewGame = () => {
		fetch(this.API_URL + 'games', {
			method: 'POST',
			mode: 'cors', // no-cors, cors, *same-origin
			headers: {
				'Content-Type': 'application/json'
			}
		}).then((res) => this.setState({ hasValidGame: true }))
	}

	render() {
		return (
			<div>
				{this.state.hasValidGame ? (
					<Game apiUrl={this.API_URL} />
				) : (
					<NewGameForm
						handleEnterGame={this.handleEnterGame}
						handleCreateNewGame={this.handleCreateNewGame}
						hasValidGame={this.state.hasValidGame}
					/>
				)}
			</div>
		)
	}
}

export default App
