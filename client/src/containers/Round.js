import React, { Component } from 'react'
import Player from '../components/Player'
import Answer from '../components/Answer'
import Prompt from '../components/Prompt'

class Round extends Component {
	colors = [ 'red', 'yellow', 'orange', 'green', 'teal', 'blue', 'purple', 'pink' ]

	state = {
		votedFor: null
	}

	componentDidMount() {
		const { is_voting_phase, prompt, answers, isMuted } = this.props
		if (!is_voting_phase || isMuted) return

		// Fetching voices is async so we check until we get it
		var timer = setInterval(() => {
			var voices = speechSynthesis.getVoices()

			if (voices.length !== 0) {
				const msg = new SpeechSynthesisUtterance()
				msg.volume = 0.5
				msg.voice = voices[7] // British voice for authenticity
				msg.text = prompt.question
				speechSynthesis.speak(msg)

				let text = ''
				text += answers[0] ? answers[0].text : ''
				text += answers[1] ? '<OR>' + answers[1].text : '<OR> <NO ANSWER>'
				msg.text = text
				speechSynthesis.speak(msg)

				clearInterval(timer)
			}
		}, 200)
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
		const { prompt, answers, is_voting_phase, players } = this.props
		let answerSty = 'animated fadeIn'
		if (!this.hasAnsweredThisRound()) answerSty += ' votable'

		return (
			<div>
				<h1 className='animated flipInY'>{is_voting_phase ? 'VOTE!' : 'RESULTS'}</h1>
				<br />
				<Prompt animated={is_voting_phase} prompt={prompt.question} />
				<div className='answers-container'>
					{answers.map((answer, i) => {
						const answerer = is_voting_phase ? null : this.getPlayerById(answer.player_id)
						const votes = this.getVotesForThisAnswer(answer)

						return (
							<div key={i} onClick={() => this.handleVote(answer)}>
								<Answer
									className={answerSty + (is_voting_phase ? ` delay-${i + 1}s` : '')}
									voted={is_voting_phase && this.state.votedFor && this.state.votedFor === answer}
									answerer={answerer}
									answer={answer.text}
									players={players}
									votes={votes}
									getPlayerById={this.getPlayerById}
									is_voting_phase={is_voting_phase}
								/>
							</div>
						)
					})}
				</div>
			</div>
		)
	}
}

export default Round
