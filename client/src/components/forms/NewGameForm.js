import React, { Component } from 'react'

class NewGameForm extends Component {
	state = {
		roomCode: ''
	}

	handleChange = (e) => {
		this.setState({ roomCode: e.target.value })
	}

	render() {
		const { handleEnterGame, handleCreateNewGame } = this.props

		return (
			<div>
				<form onSubmit={handleEnterGame}>
					<input
						type='text'
						onChange={this.handleChange}
						value={this.state.roomCode}
						placeholder='enter room code'
					/>
					<input type='submit' />
				</form>
				<button onClick={handleCreateNewGame}>Create New Game</button>
			</div>
		)
	}
}

export default NewGameForm
