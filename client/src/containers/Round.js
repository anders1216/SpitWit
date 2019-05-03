import React, { Component } from 'react'

import Player from '../components/Player'
import VoteForm from '../components/VoteForm'
import Answer from '../components/Answer'

class DisplayRound extends Component {

  constructor(){
    super()
    this.state = {
      votes: {
        answer1: "",
        answer2: ""
      }
    }

  }

  render(){
    return(
      <div>
        <p>
          DisplayRound Component
        </p>
      </div>
    )
  }

}

export default DisplayRound
