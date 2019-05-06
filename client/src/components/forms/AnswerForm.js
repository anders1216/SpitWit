import React, { Component } from 'react'
import Form from './Form'
import Prompt from '../Prompt'

const AnswerForm = (props) => {
	return (
		<div>
			<Prompt />
			<Form handleSubmit={props.handleSubmit} placeholder={"enter answer here"}/>
		</div>
	)
}

export default AnswerForm
