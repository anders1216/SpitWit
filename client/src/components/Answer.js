import React, { Component } from 'react'
import Player from '../components/Player'

const Answer = (props) => {
	return (
		<div className='answer'>
			{props.answerer && <h2>{props.answerer}</h2>}
			<div>{props.answer}</div>
			{props.votes.length > 0 && props.votes.map((vote) => <Player {...props.getPlayerById(vote.player_id)} />)}
		</div>
	)
}

export default Answer
