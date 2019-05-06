import React, { Component } from 'react'

class Form extends Component {
	state = { input: '' }

	handleChange = (e) => {
		this.setState({ input: e.target.value })
	}

	handleSubmit = (e) => {
		e.preventDefault()
		console.log(this.props)
		this.props.handleSubmit(this.state.input)
	}

	render() {
		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					<input
						type='text'
						onChange={this.handleChange}
						value={this.state.value}
						placeholder={this.props.placeholder}
					/>
					<button type='submit'>Submit </button>
				</form>
				{this.props.children}
			</div>
		)
	}
}

export default Form
