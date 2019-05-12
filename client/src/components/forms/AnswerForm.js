import React, { Component } from 'react'
import Form from './Form'
import Prompt from '../Prompt'

class AnswerForm extends Component {
	state = {
		answer1: undefined,
		answer2: undefined,
		answer3: undefined,
		answer4: undefined
	}

	handleSubmit = (input, name) => {
		this.props.handleSubmit(input, parseInt(name.slice(-1)) - 1)
	}

	render() {
		const { player_prompts, currPlayer } = this.props
		let prompts = player_prompts[currPlayer.id]
		if (!prompts) return null

		return (
			<div>
				<h1>Answer the prompts!</h1>
				<br />
				{prompts.map((prompt, i) => {
					return (
						<React.Fragment key={i}>
							<Prompt prompt={prompt.prompt} isForm />
							<Form
								name={'answer' + (i + 1)}
								disabled={this.state[`answer${i + 1}`]}
								handleSubmit={this.handleSubmit}
								placeholder={'enter answer'}
								submitOnTimerEnd
							/>
							<br />
						</React.Fragment>
					)
				})}
				<br />
				<small>Any answers left blank will be auto-filled by the server.</small>
			</div>
		)
	}
}
export default AnswerForm
