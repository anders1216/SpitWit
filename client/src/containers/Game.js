import React, { Component } from 'react'
import ActionCable from 'actioncable'

import Lobby from '../components/Lobby'
import AnswerForm from '../components/forms/AnswerForm'
import Round from './Round'
import Player from '../components/Player'

const GameContext = React.createContext()

class Game extends Component {
	state = {
		currPlayer: null,
		round_number: 0,
		timer: 0,
		players: []
	}

	// Start subscription after successfully joining game
	componentDidMount() {
		const cableUrl = this.props.apiUrl.replace(/[http|https]/g, 'ws') + '/cable'
		const cable = ActionCable.createConsumer(cableUrl)

		// Game subscription
		this.gameSub = cable.subscriptions.create('GamesChannel', {
			connected: () => console.log('connected to game.'),
			received: this.handleRecieveGameUpdate
		})

		// Player subscription
		this.playerSub = cable.subscriptions.create('PlayersChannel', {
			received: this.handleReceivePlayerUpdate
		})
	}
	//if the host leaves sends mesage to console. may update later to set an Alert that communicates to non host players the end of game.
	componentWillUnmount() {
		console.log('disconnected from game.')
	}

	//updating the round number as the game continues.
	handleReceiveGameUpdate = (data) => {
		const { timer, prompt, answers, round_number } = data

		round_number && this.setState({ roundNumber: round_number })
	}
	//adding new players to players to the players array if they havent been added.
	handleReceivePlayerUpdate = (player) => {
		if (!this.state.players.includes(player)) {
			this.setState({ players: [ ...this.state.players, player ] })
		}
	}
	//passed down to post new Player to the DB.
	setCurrentPlayer = (player) => {
		let is_host = this.props.isHost
		let game_id = this.props.game.id
		// localStorage.setItem('currPlayer': player)
		fetch('http://localhost:3000/players', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({name:player, game_id:game_id, is_host:is_host})
		})
		this.setState({ currPlayer: player })
	}

	renderJoinedPlayers() {
		return <div>{this.state.players.map((player) => <Player {...player} />)}</div>
	}
	//passed down to post new anwers to the DB.
	handleNewAnswer = (answer) => {
		let player_id = this.state.currentPlayer.id
		fetch('http://localhost:3000/answers', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({text:answer, player_id:player_id})
		}
	)
	}
//conditionally render components based on the current step of the game.

	render() {
		//defining a varaible to establish "context" based on all aspects of the context we intend to access later.
		const context  = {currPlayer: this.state.currPlayer, game: this.props.game}

	  let GameComponent;
		//set a varaible to be rendered. if the game has started render the answer from, if not render the lobby if the answerforms have been rendered and passed and the timer reaches 0, initiating a round, render round 1.
		if (this.state.round_number === 0) {
			if (this.state.timer > 0) {
				GameComponent = <AnswerForm handleSubmit={this.handleNewAnswer}/>
			}
			GameComponent =  <Lobby handleSubmit={this.setCurrentPlayer} />;
		}else{
			GameComponent = <Round />
		}

		return (
			//render the variable thats been defined above.
			<GameContext.Provider value={context}>
				{GameComponent}
			</GameContext.Provider>

		)
	}
}

export default Game
