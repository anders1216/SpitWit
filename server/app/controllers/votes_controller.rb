class VotesController < ApplicationController
  def index
    @votes = Vote.all
    render json: @votes
  end

  def create
    @vote = Vote.create(vote_params)
    answer = Answer.find(vote_params[:answer_id])
    player = Player.find(answer.player_id)

    score = 100
    
    # Auto-fill answers only get half points
    score -= 50 if answer.text.start_with?("[AUTOFILL]")

    player.update(score: player.score + score)
    render json: @vote
  end
  
  private
  
  def vote_params
    params.require(:vote).permit!
  end
end
