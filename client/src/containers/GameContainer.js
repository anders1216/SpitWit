import React, {Component} from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom';

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
      <Router>
        <Route path="/new-player-form" component={NewPlayerForm}
        <Route path="/prompt" component={() => <Prompt prompt={this.state.prompt}/>}/>
        <Route path="/answer-form" component={AnswerForm}>
        <Route path="/game" component={() => <DisplayRound prompt={this.state.prompt} answers={this.state.answers} round={this.state.round}/>}/>
      </Router>
    )
  }

}
export default GameContainer
