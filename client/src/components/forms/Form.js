import React, { Component } from 'react'

class Form extends Component {
	state = { input: '' }

	// Auto-submit on timer end
	componentWillUnmount() {
		const { submitOnTimerEnd, handleSubmit } = this.props

		if (submitOnTimerEnd) {
			handleSubmit(this.state.input, this.props.name)
		}
	}

	handleChange = (e) => {
		this.setState({ input: e.target.value })
	}

	handleSubmit = (e) => {
		e.preventDefault()
		this.props.handleSubmit(this.state.input, this.props.name)
	}

	render() {
		const { disabled, name, buttonName, children, placeholder, submitOnTimerEnd } = this.props

		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					<fieldset disabled={disabled}>
						<input
							style={disabled ? { opacity: 0.5 } : {}}
							className='input'
							name={name}
							type='text'
							onChange={this.handleChange}
							value={this.state.value}
							placeholder={placeholder}
						/>
						{!submitOnTimerEnd && (
							<button style={disabled ? { opacity: 0.5 } : {}} type='submit'>
								{buttonName ? buttonName : 'submit'}
							</button>
						)}
					</fieldset>
				</form>
				{children}
			</div>
		)
	}
}

export default Form
