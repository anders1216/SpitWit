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

		return (
			<div>
				{is_voting_phase ? 'VOTE' : 'RESULTS'}
				<Prompt prompt={prompt.question} />
				<hr />
				{answers.map((answer) => {
					const answerer = is_voting_phase ? null : this.getPlayerById(answer.player_id).name

					return (
						<div onClick={() => this.handleVote(answer)}>
							<Answer
								answerer={answerer}
								answer={answer.text}
								players={players}
								votes={this.getVotesForThisAnswer(answer)}
								getPlayerById={this.getPlayerById}
							/>
						</div>
					)
				})}
			</div>
		)
	}
}

export default Round
