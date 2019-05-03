import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import NewPlayerForm from '../components/NewPlayerForm'
import AnswerForm from '../components/AnswerForm'
import Lobby from '../components/Lobby'
import DisplayRound from './DisplayRound'
import './App.css'

class App extends Component {
	render() {
		return (
			<Router>
				<Route
					path='/'
					component={() => <NewPlayerForm player={this.state.player} handleChange={this.handleChange} />}
				/>
				<Route
					path='/lobby'
					component={() => <Lobby players={this.state.players} player={this.state.player} />}
				/>
				<Route
					path={`/${this.state.game}`}
					component={() => (
						<AnswerForm
							player={this.state.player}
							prompt={this.state.prompt}
							handleChange={this.handleChange}
						/>
					)}
				/>
			</Router>
		)
	}
}

export default App
