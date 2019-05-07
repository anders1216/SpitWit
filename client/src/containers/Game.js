import React, { Component } from "react";
import ActionCable from "actioncable";

import Lobby from "../components/Lobby";
import AnswerForm from "../components/forms/AnswerForm";
import Round from "./Round";
import Player from "../components/Player";

// This is the main component that handles subscriptions.
// The main communication is between the host's client and the server.
// The host's client will control any timers which are used to progress the game.
//
// During a game loop, the follow commuication of data occurs:
//   1. Server sends data for prompt and answers to display for current round
//   2. Host sends the timer to the server for voting mode, decrementing every second
//   3. Server updates the timer received from host until it reaches 0
//   4. When the timer hits 0, the server sends data to set voting mode off to display results
//   5. Host sends timer again for how long to display vote results
//   6. When the timer for post-voting hits 0, the server increments round and repeats loop
//
// The shape of the data being passed between host and server from the GamesChannel:
// {
//   timer: number,             # seconds remaining for this round
//   is_voting_phase: boolean,  # true if this voting round false if displaying vote results
//   round_number: number,      # current round number
//   player_prompts: object,    # array of objects mapping player id to assigned prompts
//   round: {                   # object that contains information for round
//	   prompt: string,
//     answers: {               # object that maps player to answer
//	     [player1Id]: string,
//       [player2Id]: string
//     },
//     votes: {                 # object that maps voter id to answerer id
//	     [player3Id]: number,
//       [player4Id]: number
//     }
//   }
// }

export const GameContext = React.createContext();

class Game extends Component {
  intervalId;
  state = {
    currPlayer: null,
    players: [],
    player_prompts: null,
    round_number: 0,
    is_voting_phase: false,
    timer: 0,
    round: {
      answers: {},
      votes: {}
    }
  };

  // Start subscription after successfully joining game
  componentDidMount() {
    const cableUrl = this.props.apiUrl.replace(/(https|http)/g, "ws") + "cable";
    const cable = ActionCable.createConsumer(cableUrl);

    // Game subscription
    this.gameSub = cable.subscriptions.create("GamesChannel", {
      connected: () => console.log("connected to game."),
      received: this.handleReceiveGameUpdate
    });

    // Player subscription
    this.playerSub = cable.subscriptions.create("PlayersChannel", {
      received: this.handleReceivePlayersUpdate
    });
  }
  // If the host leaves sends mesage to console. may update later to set an Alert that communicates to non host players the end of game.
  componentWillUnmount() {
    console.log("disconnected from game.");
  }

  //updating the round number as the game continues.
  handleReceiveGameUpdate = game => {
    const { timer, round, round_number, player_prompts } = game;

    round_number && this.setState({ round_number: round_number });
    player_prompts && this.setState({ player_prompts: player_prompts });
    console.log(player_prompts);
  };

  // Adding new players to players to the players array if they havent been added.
  handleReceivePlayersUpdate = players => {
    this.setState({ players });
  };

  // Passed down to post new Player to the DB.
  createNewPlayer = playerName => {
    const { isHost, game } = this.props;
    // localStorage.setItem('currPlayer': player)

    fetch(this.props.apiUrl + "players", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: playerName,
        game_id: game.id,
        is_host: isHost
      })
    })
      .then(res => res.json())
      .then(player => {
        this.setState({ currPlayer: player });
      });
  };

  renderJoinedPlayers() {
    return (
      <div>
        {this.state.players.map(player => (
          <Player {...player} />
        ))}
      </div>
    );
  }

  startGame = () => {
    this.setState({ timer: 90 }, () => {
      this.intervalId = setInterval(() => {
        this.setState({ timer: this.state.timer - 1 });
      }, 1000);
    });
    this.gameSub.send({ game_id: this.props.game.id, timer: 90 });
  };

  // passed down to post new anwers to the DB.
  handleNewAnswer = (answer, num) => {
    const { currPlayer, player_prompts } = this.state;
    const { apiUrl, game } = this.props;
    console.log(player_prompts[currPlayer.id][num].round_id);
    fetch(apiUrl + "answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        answer: {
          text: answer,
          player_id: currPlayer.id,
          round_id: player_prompts[currPlayer.id][num].round_id
        }
      })
    });
  };

  render() {
    const { currPlayer, players, round, player_prompts } = this.state;
    const { game } = this.props;

    // Conditionally render components based on the current state of the game.
    let GameComponent;
    if (this.state.round_number === 0) {
      if (player_prompts) {
        GameComponent = (
          <AnswerForm
            handleSubmit={this.handleNewAnswer}
            currPlayer={currPlayer}
            game={game}
            player_prompts={player_prompts}
          />
        );
      } else {
        GameComponent = (
          <Lobby
            handleStartGame={this.startGame}
            handleSubmit={this.createNewPlayer}
            players={players}
            currPlayer={currPlayer}
            game={game}
          />
        );
      }
    } else {
      GameComponent = (
        <Round round={round} currPlayer={currPlayer} game={game} />
      );
    }

    return <div>{GameComponent}</div>;
  }
}

export default Game;
