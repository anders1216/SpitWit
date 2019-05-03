import React, { Component } from 'react'
import Prompt from '../Prompt'

const AnswerForm = (props) => {
	return (
		<div>
			<Prompt />
			<Form onSubmit={"handleNewAnswer"} placeholder={"enter answer here"}/>
		</div>
	)
}

export default AnswerForm
