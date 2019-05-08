import React, { Component } from 'react'

const Endgame = (props) => {
	return (
		<div>
			<ul>{props.players.map((player) => <li>{`${player.name} - ${player.score}`}</li>)}</ul>
		</div>
	)
}

export default Endgame
