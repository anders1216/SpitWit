import React, {Component} from 'react'

import NewPlayerForm from '../components/NewPlayerForm'
import Prompt from '../components/Prompt'
import AnswerForm from '../components/AnswerForm'

import  DisplayRound from './DisplayRound'


class GameContainer extends Component {

  constructor(){
    super()
    this.state = {
      round: "",
      prompt: "",
      answers: []
    }
  }

  componentDidMount(){
    fetch(PROMPT_URL).then(res => res.json()).then(prompts => setPrompt(prompts))
  }

  setPrompt = (prompts) => {
    const randomIndex = prompts.length * Math.random()
    randomIndex = randomIndex.floor()
    if(prompts[randomIndex]){
      const newPrompt = prompts[randomIndex]
    }else{
      const newPrompt = prompts[randomIndex - 1]
    }

    this.setState({prompt: newPrompt})
  }

  render(){
    return(

    )
  }

}
export default GameContainer
