import React, { Component } from "react";
import Form from "./Form";
import Prompt from "../Prompt";

class AnswerForm extends Component {
  state = {
    answer1: false,
    answer2: false
  };

  handleSubmit = (input, name) => {
    this.setState({ [name]: true }, console.log(this.state));
    this.props.handleSubmit(input, parseInt(name.slice(-1)) - 1);
  };

  render() {
    const { player_prompts, currPlayer } = this.props;
    const { answer1, answer2 } = this.state;
    let playersPrompts = player_prompts[currPlayer.id];
    return (
      <div>
        <Prompt prompt={playersPrompts[0]} />
        <Form
          name={"answer1"}
          disabled={answer1}
          handleSubmit={this.handleSubmit}
          placeholder={"enter answer here"}
        />
        <Prompt prompt={playersPrompts[1]} />
        <Form
          name={"answer2"}
          disabled={answer2}
          handleSubmit={this.handleSubmit}
          placeholder={"enter answer here"}
        />
      </div>
    );
  }
}
export default AnswerForm;
