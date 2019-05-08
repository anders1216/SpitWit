class VotesController < ApplicationController
  def index
    @votes = Vote.all
    render json: @votes
  end

  def create
    @vote = Vote.create(vote_params)
    player = Player.find(Answer.find(vote_params[:answer_id]).player_id)
    player.update(score: player.score + 100)
    render json: @vote
  end
  
  private
  
  def vote_params
    params.require(:vote).permit!
  end
end
