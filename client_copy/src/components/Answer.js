import React, { Component } from 'react'
import Player from '../components/Player'

const Answer = (props) => {
	const answerSty = {}
	if (!props.votes.length > 0) answerSty.paddingBottom = '1em'
	if (!props.answerer) answerSty.padding = '0.1em'

	return (
		<div className={`answer ${props.voted && 'voted'} ` + props.className}>
			{props.answerer && <Player isAnswerer i={props.players.indexOf(props.answerer)} {...props.answerer} />}
			<h2>{props.answer}</h2>
			<div className='player-votes' style={answerSty}>
				{props.votes.length > 0 &&
					props.votes.map((vote) => (
						<Player
							isVote
							i={props.players.indexOf(props.getPlayerById(vote.player_id))}
							{...props.getPlayerById(vote.player_id)}
						/>
					))}
			</div>
		</div>
	)
}

export default Answer