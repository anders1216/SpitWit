class GamesChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'games'
  end

  # Destroy game and disconnect everyone if host disconnects
  def unsubscribed

  end

  def receive(data)
    game = Game.find(data["game_id"])

    # There are two timers for the voting round and post-voting round
    # All timers will be updated/ticked-down by the host's client
    # New rounds start in voting mode, then switch to post-voting when that timer hits 0
    # Voting round will be 90 seconds
    # Post-voting round will display vote results for 3 seconds

    if data["timer"] == 90
      player_prompts = {}
      prompts = Prompt.all.sample(game.players.length)
      prompts.each_with_index do |prompt, i|
        Round.create(prompt_id: prompt.id, round_number: i+1, game_id: game.id)
        player_prompts[game.players[i].id] ||= []
        player_prompts[game.players[i].id] << prompt[:question]
        if(i+1 == prompts.length)
          player_prompts[game.players[0].id] << prompt[:question]
        else
          player_prompts[game.players[i+1].id] ||= []
          player_prompts[game.players[i+1].id] << prompt[:question]
        end
      end
      ActionCable.server.broadcast('games', {player_prompts: player_prompts})
    elsif data["timer"] > 0
      # Decrement timer
      ActionCable.server.broadcast('games', {
        timer: data["timer"]
      })
    elsif data["timer"] == 0
      # Timer hit 0 after voting round, progress to next round
      if !is_voting_round
        new_round = game.round_number + 1
        game.update!(round_number: new_round)

        ActionCable.server.broadcast('games', {
          round_number: new_round,
          is_voting_round: !data["is_voting_round"],
          timer: data["timer"]
        })
      else
        round = game.rounds[game.round_number]
        prompt = round.prompt
        answers = round.answers
        # Toggle is_voting_round on new round
        ActionCable.server.broadcast('games', {
          is_voting_round: !data["is_voting_round"],
          votes: {
            "#{answers[0].player.id}": answers[0].votes.size,
            "#{answers[1].player.id}": answers[1].votes.size
          },
          timer: data["timer"]
        })
      end
    end
  end
end
