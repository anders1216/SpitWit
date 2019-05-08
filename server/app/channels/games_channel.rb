require_relative './dummy_answers.rb'

class GamesChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'games'
  end

  # Destroy game and disconnect everyone if host disconnects
  def unsubscribed

  end

  def receive(data)
    # A way to re-seed database from client
    if data["RESET"]
      Round.delete_all
      Answer.delete_all
      Player.delete_all
      Game.delete_all

      game = Game.create(id: 1, room_code: "TEST", round_number: 0)
      Player.create(id: 1, game_id: 1, name: "PLAYER ONE 👑", is_host: true)
      Player.create(id: 2, game_id: 1, name: "PLAYER TWO", is_host: false)
      Player.create(id: 3, game_id: 1, name: "PLAYER THREE", is_host: false)

      player_prompts = game.create_rounds
      player_prompts.keys.each do |player|
        if player != 1
          Answer.create(
            text: DummyAnswers.all.sample,
            round_id: player_prompts[player][0][:round_id],
            player_id: player
          )
          Answer.create(
            text: DummyAnswers.all.sample,
            round_id: player_prompts[player][1][:round_id],
            player_id: player
          ) 
        end
      end
      ActionCable.server.broadcast('games', {player_prompts: player_prompts, timer: 15, test: true})
      return
    end

    game = Game.find(data["game_id"])

    # There are two timers for the voting round and post-voting round
    # All timers will be updated/ticked-down by the host's client
    # New rounds start in voting mode, then switch to post-voting when that timer hits 0
    # Voting round will be 90 seconds
    # Post-voting round will display vote results for 3 seconds
    if game.round_number == 0 && data["timer"] == data["timeLimit"]
      player_prompts = game.create_rounds
      ActionCable.server.broadcast('games', {player_prompts: player_prompts})
    elsif game.round_number > 0 && data["timer"] == data["timeLimit"]
      round = Round.find_by(game_id: game.id, round_number: game.round_number)

      # Pass round data to be access in round render
      ActionCable.server.broadcast('games', {round: {
        prompt: round.prompt,
        answers: round.answers,
      }})
    elsif game.round_number > game.rounds.size
      ActionCable.server.broadcast('games', {
        has_ended: true
      })
    elsif data["timer"] > 0
      # Decrement timer
      ActionCable.server.broadcast('games', {
        timer: data["timer"]
      })
    elsif data["timer"] == 0
      # Timer hit 0 after voting round, progress to next round
      if !data["is_voting_phase"]

        new_round = game.round_number + 1
        game.update!(round_number: new_round)

        ActionCable.server.broadcast('games', {
          round_number: new_round,
          is_voting_phase: !data["is_voting_phase"]
        })
      else
        # byebug
        round = Round.find_by(game_id: game.id, round_number: game.round_number)

        # Toggle is_voting_phase on new round

        ActionCable.server.broadcast('games', {
          round_number: game.round_number,
          is_voting_phase: !data["is_voting_phase"],
          round: {
            votes: [round.answers[0].votes, round.answers[1].votes].flatten
          }
        })
      end
    end
  end
end
