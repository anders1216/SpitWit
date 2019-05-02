class GamesController < ApplicationController
  def index
    @games = Game.all
    render json: @games
  end
 
  def create
    @game = Game.create
    render json: @game
  end

  def update
    @game = Game.find(params[:id])
    @game.update(game_params)

    if @game.save
      render json: @game, status: :accepted
    else
      render json: { errors: @game.errors.full_messages }, status: :unprocessible_entity
    end
  end
end
