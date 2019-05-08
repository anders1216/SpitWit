import React, { Component } from 'react'
import Player from '../components/Player'
import Answer from '../components/Answer'
import Prompt from '../components/Prompt'

class Round extends Component {
	state = {
		votedFor: null
	}

	handleVote = (answer) => {
		if (this.state.votedFor) return

		this.setState({ votedFor: answer })
		this.props.handleVote(answer)
	}

	render() {
		const { prompt, answers, votes, handleVote, players } = this.props

		return (
			<div>
				<Prompt prompt={prompt.question} />
				<hr />
				<div onClick={() => this.handleVote(answers[0])}>
					<Answer answer={answers[0].text} votes={votes} />
				</div>
				<div onClick={() => this.handleVote(answers[1])}>
					<Answer answer={answers[1].text} votes={votes} />
				</div>
			</div>
		)
	}
}

export default Round
