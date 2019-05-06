class VotesController < ApplicationController
  def index
    @votes = Vote.all
    render json: @votes
  end

  def create
    @vote = Vote.create(vote_params)
    render json: @vote
  end

  def update
    @vote = Vote.find(params[:id])
    @vote.update(vote_params)

    if @vote.save
      render json: @vote, status: :accepted
    else
      render json: { errors: @vote.errors.full_messages }, status: :unprocessible_entity
    end
  end
  
  private
  
  def vote_params
    params.require(:vote).permit!
  end
end
