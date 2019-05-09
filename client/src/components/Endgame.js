import React, { Component } from 'react'
import Answer from './Answer'

const Endgame = ({ players, best_answer, handleBackToMainMenu, handlePlayAgain }) => {
	return (
		<div>
			<h1>SCOREBOARD</h1>
			<hr />
			<table>
				<tbody>
					{players.sort((p1, p2) => p2.score - p1.score).map((player, i) => (
						<tr key={i}>
							<td>
								{i === 0 ? '👑' : ' '} {player.name}
							</td>
							<td>{player.score}</td>
						</tr>
					))}
				</tbody>
			</table>
			<br />
			<br />
			<br />
			{best_answer && (
				<React.Fragment>
					<h2>Best Answer</h2>
					<Answer
						answerer={players.find((player) => player.id === best_answer.player_id)}
						answer={best_answer.text}
						players={players}
						votes={best_answer}
					/>
				</React.Fragment>
			)}
			<br />
			{/*<button onClick={handlePlayAgain}>Play Again</button>*/}
			<button onClick={handleBackToMainMenu}>Back to Main Menu</button>
		</div>
	)
}

export default Endgame
