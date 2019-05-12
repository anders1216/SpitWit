require_relative './autofill_answers.rb'

class AnswersController < ApplicationController
  def index
    @answers = Answer.all
    render json: @answers
  end

  def create
    answer = answer_params[:text]
    answer.slice! "[AUTOFILL]" # In case people are cheeky and include this manually

    # Autofill answer if left blank
    if (answer == "")
      answer = "[AUTOFILL] " + AutofillAnswers.random
    end

    player_id = answer_params[:player_id]
    round_id = answer_params[:round_id]
    # Avoid duplicates
    if (!Answer.find_by(player_id: player_id,round_id: round_id))
      @answer = Answer.find_or_create_by(
        text: answer,
        player_id: player_id,
        round_id: round_id
      )
    end

    render json: @answer
  end

  private

  def answer_params
    params.require(:answer).permit!
  end
end
