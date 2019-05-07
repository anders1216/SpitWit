class GamesChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'games'
  end

  # Destroy game and disconnect everyone if host disconnects
  def unsubscribed

  end

  def receive(data)
    if data["NUKE"]
      Round.delete_all
      Answer.delete_all
      Player.delete_all
      Game.delete_all
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
          is_voting_phase: !data["is_voting_phase"],
          timer: data["timeLimit"]
        })
      else
        round = game.rounds[game.round_number]
        prompt = round.prompt
        answers = round.answers

        # Toggle is_voting_phase on new round
        ActionCable.server.broadcast('games', {
          is_voting_phase: !data["is_voting_phase"],
          round: {
            votes: {
              "#{answers[0].player.id}": answers[0].votes.size,
              "#{answers[1].player.id}": answers[1].votes.size
            },
          },
          timer: data["timer"]
        })
      end
    end
  end
end
