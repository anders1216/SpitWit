class GamesChannel < ApplicationCable::Channel
  @player_prompts = {}

  def subscribed
    stream_from "games:#{params["game_id"]}"
  end

  # Destroy game and disconnect everyone if host disconnects
  def unsubscribed

  end

  def receive(data)
    game = Game.find(data["game_id"])
    return if (!game) 

    # There are two timers for the voting round and post-voting round
    # All timers will be updated/ticked-down by the host's client
    # New rounds start in voting mode, then switch to post-voting when that timer hits 0
    # Voting round will be 90 seconds
    # Post-voting round will display vote results for 3 seconds
    if game.round_number == 0 && data["timer"] == data["timeLimit"]
      @player_prompts = game.create_rounds
      ActionCable.server.broadcast("games:#{data["game_id"]}", {player_prompts: @player_prompts})
    elsif game.round_number > 0 && data["timer"] == data["timeLimit"]
      round = Round.find_by(game_id: game.id, round_number: game.round_number)

      ActionCable.server.broadcast("games:#{data["game_id"]}", {
        prompt: round.prompt,
        answers: round.answers
      })
    # END GAME
    elsif game.round_number > game.rounds.size
      ActionCable.server.broadcast("games:#{data["game_id"]}", {
        has_ended: true,
        best_answer: game.get_best_answer
      })
    elsif data["timer"] > 0
      # Decrement timer
      ActionCable.server.broadcast("games:#{data["game_id"]}", {
        timer: data["timer"]
      })
    elsif data["timer"] == 0
      # Timer hit 0 after voting round, progress to next round
      if !data["is_voting_phase"]

        new_round = game.round_number + 1
        game.update!(round_number: new_round)

        ActionCable.server.broadcast("games:#{data["game_id"]}", {
          round_number: new_round,
          is_voting_phase: !data["is_voting_phase"]
        })
      else
        round = Round.find_by(game_id: game.id, round_number: game.round_number)
        votes = round.answers.map {|answer| answer.votes}
        # Toggle is_voting_phase on new round

        ActionCable.server.broadcast("game-#{data['game_id']}:players", game.players)        
        ActionCable.server.broadcast("games:#{data["game_id"]}", {
          round_number: game.round_number,
          is_voting_phase: !data["is_voting_phase"],
          votes: votes.flatten
        })
      end
    end
  end
end
