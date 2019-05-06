import React, { Component } from 'react'
import Form from './Form'

const NewPlayerForm = (props) => {
	return (
		<div>
			<Form handleSubmit={props.handleSubmit} placeholder={'enter player name'} />
		</div>
	)
}

export default NewPlayerForm
