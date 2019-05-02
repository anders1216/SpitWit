class AnswersController < ApplicationController
  def index
    @answers = Answer.all
    render json: @answers
  end
 
  def create 
    @answer = Answer.create(answer_params)
    
    #ActionCable.server.broadcast('answers', data)
    render json: @answer
  end

  def update
    @answer = Answer.find(params[:id])
    @answer.update(answer_params)

    if @answer.save
      render json: @answer, status: :accepted
    else
      render json: { errors: @answer.errors.full_messages }, status: :unprocessible_entity
    end
  end
 
  private
 
  def answer_params
    params.permit!
  end
end
