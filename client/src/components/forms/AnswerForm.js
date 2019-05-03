import React, { Component } from 'react'
import Prompt from '../Prompt'

const AnswerForm = (props) => {
	return (
		<div>
			<Prompt />
			<form onSubmit={props.handleSubmit}>
				<input type='text' onChange={props.handleChange} value={props.player.name} placeholder='Who are you?' />
				<button type='submit'>Submit </button>
			</form>
		</div>
	)
}

export default AnswerForm
