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

	getPlayerById = (id) => {
		return this.props.players.find((player) => player.id === id)
	}

	getVotesForThisAnswer = (answer) => {
		return this.props.votes.filter((vote) => vote.answer_id === answer.id)
	}

	render() {
		const { prompt, answers, votes, is_voting_phase, handleVote, players } = this.props
		const answerer1 = is_voting_phase ? null : this.getPlayerById(answers[0].player_id).name
		const answerer2 = is_voting_phase ? null : this.getPlayerById(answers[1].player_id).name

		return (
			<div>
				{is_voting_phase ? 'VOTE' : 'RESULTS'}
				<Prompt prompt={prompt.question} />
				<hr />
				<div onClick={() => this.handleVote(answers[0])}>
					<Answer
						answerer={answerer1}
						answer={answers[0].text}
						votes={this.getVotesForThisAnswer(answers[0])}
						getPlayerById={this.getPlayerById}
					/>
				</div>
				<br />
				<div onClick={() => this.handleVote(answers[1])}>
					<Answer
						answerer={answerer2}
						answer={answers[1].text}
						votes={this.getVotesForThisAnswer(answers[1])}
						getPlayerById={this.getPlayerById}
					/>
				</div>
			</div>
		)
	}
}

export default Round
