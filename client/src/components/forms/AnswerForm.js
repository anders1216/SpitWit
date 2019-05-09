import React, { Component } from 'react'
import Form from './Form'
import Prompt from '../Prompt'

class AnswerForm extends Component {
	state = {
		answer1: false,
		answer2: false,
		answer3: false,
		answer4: false
	}

	handleSubmit = (input, name) => {
		this.setState({ [name]: true })
		// Get index of answer from name
		this.props.handleSubmit(input, parseInt(name.slice(-1)) - 1)
	}

	render() {
		const { player_prompts, currPlayer } = this.props
		let prompts = player_prompts[currPlayer.id]
		if (!prompts) return null

		return (
			<div>
				{prompts.map((prompt, i) => {
					console.log('answer' + (i + 1))

					return (
						<React.Fragment key={i}>
							<Prompt prompt={prompt.prompt} isForm />
							<Form
								name={'answer' + (i + 1)}
								disabled={this.state[`answer${i + 1}`]}
								handleSubmit={this.handleSubmit}
								placeholder={'enter answer'}
							/>
							<br />
						</React.Fragment>
					)
				})}
			</div>
		)
	}
}
export default AnswerForm
