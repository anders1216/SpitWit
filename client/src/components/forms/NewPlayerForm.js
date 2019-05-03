import React, {Component} from 'react'

const NewPlayerForm = (props) => {
  return(
    <div>
      <form>
        <input type="text" onChange={props.handleChange} value={props.player.name} placeholder="Who are you?"></input>
      </form>
    </div>
  )
}

export default NewPlayerForm
