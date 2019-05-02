class VotesChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'votes'
  end
end
