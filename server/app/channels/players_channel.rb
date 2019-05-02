class PlayersChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'players'
  end

  # Destroy game and disconnect everyone if host disconnects
  def unsubscribed
  end
end
