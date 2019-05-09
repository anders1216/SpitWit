import React, { Component } from 'react'

const Prompt = (props) => {
	return (
		<div className={`${props.isForm ? 'form' : 'prompt'} ${props.animated ? 'animated zoomIn' : ''}`}>
			<h2>{props.prompt}</h2>
		</div>
	)
}

export default Prompt
