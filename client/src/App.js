import React, { Component } from 'react'
<<<<<<< HEAD
import NewGameForm from './components/forms/NewGameForm'
import Lobby from './components/Lobby'
=======
import NewGameForm from '../components/forms/NewGameForm'
import Game from './containers/Game'
>>>>>>> 76724763a0d13925228e428a6796745214ed18a5
import './App.css'

class App extends Component {
	API_URL = 'http://localhost:3000/'

	state = {
		hasValidGame: false
	}

	handleEnterGame = (roomCode) => {
		fetch(this.API_URL).then((res) => res.json()).then((games) => {
			if (games.some((game) => game.room_code === roomCode)) {
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
