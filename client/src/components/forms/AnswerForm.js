import React, { Component } from 'react'
import Form from './Form'
import Prompt from '../Prompt'

const AnswerForm = (props) => {
	
let playersPrompts = props.player_prompts[props.currPlayer.id]
	return (
		<div>
		<Prompt prompt={playersPrompts[0]}/>
		<Form handleSubmit={props.handleSubmit} placeholder={"enter answer here"}/>
		<Prompt prompt={playersPrompts[1]}/>
		<Form handleSubmit={props.handleSubmit} placeholder={"enter answer here"}/>
		</div>
	)
}

export default AnswerForm
