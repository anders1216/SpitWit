import React, {Component} from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import NewPlayerForm from '../components/NewPlayerForm'
import AnswerForm from '../components/AnswerForm'
import Lobby from '../components/Lobby'
import  DisplayRound from './DisplayRound'


class GameContainer extends Component {

  handleChange = (ev) => {
    let stateToSet = ev.target.name
    let newStateValue = ev.target.value
    this.setState({newState: newStateValue})
  }

  constructor(){
    super()
    this.state = {
      game: "",
      round: "",
      prompt: "",
      answers: [],
      players: [],
      currentPlayer: ""
    }
  }

  render(){
    return(
      <Router>
        <Route path="/" component={() => <NewPlayerForm player={this.state.player} handleChange={this.handleChange}/>} />
        <Route path="/lobby" component={() => <Lobby players={this.state.players} player={this.state.player}/>} />
        <Route path={`/${this.state.game}`} component={() => <AnswerForm player={this.state.player} prompt={this.state.prompt} handleChange={this.handleChange} />} />
      </Router>
    )
  }

}
export default GameContainer

// ___________________________________________________________________________________________________________________



// setPrompt = (prompts) => {
//   let newPrompt;
//   const randomIndex = prompts.length * Math.random()
//   randomIndex = randomIndex.floor()
//   if(prompts[randomIndex]){
//     newPrompt = prompts[randomIndex]
//   }else{
//     newPrompt = prompts[randomIndex - 1]
//   }
//
//   this.setState({prompt: newPrompt})
// }
