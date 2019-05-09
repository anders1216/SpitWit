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
		const { is_voting_phase, currPlayer, handleVote } = this.props
		if (!is_voting_phase || this.state.votedFor || this.hasAnsweredThisRound()) return

		this.setState({ votedFor: answer })
		handleVote(answer)
	}

	getPlayerById = (id) => {
		return this.props.players.find((player) => player.id === id)
	}

	getVotesForThisAnswer = (answer) => {
		return this.props.votes.filter((vote) => vote.answer_id === answer.id)
	}

	// Return true if current player has an answer this round
	hasAnsweredThisRound = () => {
		const { answers, currPlayer } = this.props
		return answers.some((answer) => answer.player_id === currPlayer.id)
	}

	render() {
		const { prompt, answers, votes, is_voting_phase, handleVote, players } = this.props
		let answerSty = 'animated fadeIn'
		if (!this.hasAnsweredThisRound()) answerSty += ' votable'

		return (
			<div>
				<h1 className='animated flipInY'>{is_voting_phase ? 'VOTE!' : 'RESULTS'}</h1>
				<br />
				<Prompt animated={is_voting_phase} prompt={prompt.question} />
				{answers.map((answer, i) => {
					const answerer = is_voting_phase ? null : this.getPlayerById(answer.player_id)

					return (
						<div key={i} onClick={() => this.handleVote(answer)}>
							<Answer
								className={answerSty + (is_voting_phase ? ` delay-${i + 1}s` : '')}
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
