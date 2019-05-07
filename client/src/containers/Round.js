import React, { Component } from "react";
import Player from "../components/Player";
import Answer from "../components/Answer";

class Round extends Component {
  render() {
    return <div>{this.props.round_number}</div>;
  }
}

export default Round;
