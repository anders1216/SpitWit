import React, { Component } from 'react'

const Endgame = (props) => {
	return (
		<div>
			<ul>{props.players.map((player) => <p>{`${player.name} - ${player.score}`}</p>)}</ul>
		</div>
	)
}

export default Endgame
