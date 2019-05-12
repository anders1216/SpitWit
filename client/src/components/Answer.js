import React from 'react'
import Player from '../components/Player'

const Answer = (props) => {
	const answerSty = {}
	if (props.votes && !props.votes.length > 0) answerSty.paddingBottom = '1em'
	if (!props.answerer) answerSty.padding = '0.1em'

	const isAutofill = props.answer && props.answer.startsWith('[AUTOFILL]')
	const score = isAutofill ? 50 : 100
	const answer = props.answer && props.answer.replace('[AUTOFILL] ', '')

	return (
		<div className={`answer ${props.voted && 'voted'} ` + props.className}>
			{props.answerer && <Player isAnswerer i={props.players.indexOf(props.answerer)} {...props.answerer} />}
			<h2>
				{isAutofill && <span style={{ color: 'grey' }}>[AUTOFILL] </span>}
				{answer}
			</h2>
			<div className='player-votes' style={answerSty}>
				{props.votes &&
					props.votes.length > 0 &&
					props.votes.map((vote, i) => (
						<Player
							isVote
							key={i}
							i={props.players.indexOf(props.getPlayerById(vote.player_id))}
							{...props.getPlayerById(vote.player_id)}
						/>
					))}
				{!props.is_voting_phase &&
				props.votes &&
				props.votes.length > 0 && (
					<div className='score animated bounceIn delay-2s'>+{props.votes.length * score}</div>
				)}
			</div>
		</div>
	)
}

export default Answer
