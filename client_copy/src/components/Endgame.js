import React, { Component } from 'react'

const Endgame = (props) => {
	return (
		<div>
			<h1>SCOREBOARD</h1>
			<hr />
			<table>
				{props.players.sort((p1, p2) => p2.score - p1.score).map((player, i) => (
					<tr>
						<td>
							{i === 0 ? '👑' : ' '} {player.name}
						</td>
						<td>{player.score}</td>
					</tr>
				))}
			</table>
		</div>
	)
}

export default Endgame
