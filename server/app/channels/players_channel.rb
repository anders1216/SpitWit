class PlayersChannel < ApplicationCable::Channel
  @host

  def subscribed
    stream_from "game-#{params['game_id']}:players"
  end

  # Destroy game and disconnect everyone if host disconnects
  def unsubscribed
    if @host
      game = @host.game

      # Do cleanup
      # Delete everything for game 
      if game 
        game.rounds.each {|round| round.answers.destroy_all}
        game.rounds.destroy_all
        game.players.destroy_all 
        game.destroy
      end
    end
  end

  def receive(data)
    @host = Player.find(data["host_id"]) if (data["host_id"])
  end
end
