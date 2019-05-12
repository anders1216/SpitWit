import React, { Component } from 'react'
import Form from './Form'

const NewGameForm = (props) => {
	const { handleEnterGame, handleCreateNewGame, handleQuickJoin } = props

	return (
		<div>
			<Form handleSubmit={handleEnterGame} placeholder={'enter room code'} buttonName='join'>
				<React.Fragment>
					<br />
					<h3>OR</h3>
					<br />
					<button onClick={handleQuickJoin}>Quick Join</button>
					<br />
					<button onClick={handleCreateNewGame}>Create New Game</button>
				</React.Fragment>
			</Form>
		</div>
	)
}

export default NewGameForm

// <form onSubmit={handleEnterGame}>
// 	<input
// 		type='text'
// 		onChange={this.handleChange}
// 		value={this.state.roomCode}
// 		placeholder='enter room code'
// 	/>
// 	<input type='submit' />
// </form>
// <button onClick={handleCreateNewGame}>Create New Game</button>
