import React, { Component } from 'react'
import Player from '../components/Player'
import Answer from '../components/Answer'
import Prompt from '../components/Prompt'

class Round extends Component {
	colors = [ 'red', 'yellow', 'orange', 'green', 'teal', 'blue', 'purple', 'pink' ]

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
				<h1>{is_voting_phase ? 'VOTE!' : 'RESULTS'}</h1>
				<br />
				<Prompt animated={is_voting_phase} prompt={prompt.question} />
				{answers.map((answer, i) => {
					const answerer = is_voting_phase ? null : this.getPlayerById(answer.player_id)

					return (
						<div onClick={() => this.handleVote(answer)}>
							<Answer
								className={is_voting_phase ? `animated fadeIn delay-${i + 1}s` : ''}
								voted={is_voting_phase && this.state.votedFor && this.state.votedFor === answer}
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
