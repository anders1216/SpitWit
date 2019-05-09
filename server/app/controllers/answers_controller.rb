class AnswersController < ApplicationController
  def index
    @answers = Answer.all
    render json: @answers
  end

  def create
    if (answer_params[:text] != '')
      @answer = Answer.create(
        text: answer_params[:text],
        player_id: answer_params[:player_id],
        round_id: answer_params[:round_id]
      )
    end

    render json: @answer
  end

  private

  def answer_params
    params.require(:answer).permit!
  end
end
