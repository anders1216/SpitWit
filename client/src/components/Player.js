import React from 'react'

const colors = [ 'red', 'yellow', 'orange', 'green', 'teal', 'blue', 'purple', 'pink' ]

const Player = (props) => {
	return (
		<div
			className={`player ${colors[props.i]} ${props.isVote && 'vote animated tada'} ${props.isAnswerer &&
				'answerer'}`}>
			{props.name && props.name}
		</div>
	)
}

export default Player
