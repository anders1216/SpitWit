import React, { Component } from 'react'

const Prompt = (props) => {
	return <div className={props.isForm ? 'form' : 'prompt'}>{props.prompt}</div>
}

export default Prompt
