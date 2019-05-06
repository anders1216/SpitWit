class VotesController < ApplicationController
  def index
    @votes = Vote.all
    render json: @votes
  end

  def create
    @vote = Vote.create(vote_params)
    render json: @vote
  end
  
  private
  
  def vote_params
    params.require(:vote).permit!
  end
end
