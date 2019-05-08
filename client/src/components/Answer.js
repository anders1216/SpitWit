import React, { Component } from 'react'
import Player from '../components/Player'

const Answer = (props) => {
	return (
		<div className='answer'>
			{props.answerer && <p>{props.answerer}</p>}
			<h2>{props.answer}</h2>
			<div className='player-votes'>
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
