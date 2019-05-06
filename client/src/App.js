import React, { Component } from 'react'
import NewGameForm from './components/forms/NewGameForm'
import Game from './containers/Game'
import './App.css'

class App extends Component {
	API_URL = 'http://localhost:3000/'

	state = {
    isHost: false,
    game: null
	}

	handleEnterGame = (ev, roomCode) => {
    ev.preventDefault()
    console.log(roomCode)
		fetch(this.API_URL + "games").then((res) => res.json()).then((games) => {
      const game = games.some((game) => game.room_code === roomCode)
      if (game) {
				this.setState({ game: game })
			}

		})
	}

	handleCreateNewGame = () => {
		fetch(this.API_URL + 'games', {
			method: 'POST',
			mode: 'cors', // no-cors, cors, *same-origin
			headers: {
				'Content-Type': 'application/json'}}).then(res => res.json())
      .then(game => this.setState({ game: game, isHost: true }))
	}

	render() {
		return (
			<div>
				{this.state.game ? (
					<Game game={this.state.game} ishHost={this.state.isHost} apiUrl={this.API_URL} />
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
