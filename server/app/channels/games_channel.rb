class GamesChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'games'
  end

  # Destroy game and disconnect everyone if host disconnects
  def unsubscribed
    
  end

  def receive(data)
    game = Game.find(data["id"])
    game.update!(round: data["round"])
    ActionCable.server.broadcast('games', data)
  end
end
