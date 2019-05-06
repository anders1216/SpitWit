class AnswersController < ApplicationController
  def index
    @answers = Answer.all
    render json: @answers
  end
 
  def create 
    @answer = Answer.create(
      text: answer_params[:text],
      player_id: answer_params[:player_id],
      round_id: Round.find_by(round_number: answer_params[:round_number], game_id: answer_params[:game_id]).id
    )
    
    render json: @answer
  end
 
  private
 
  def answer_params
    params.require(:answer).permit!
  end
end
