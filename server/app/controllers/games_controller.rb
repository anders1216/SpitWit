class GamesController < ApplicationController
  def index
    @games = Game.all
    render json: @games
  end
 
  def create
    init = {
      room_code: Game.generate_room_code, 
      round_number: 0
    }
 
    @game = Game.create!(init)
    render json: @game
  end

  def quick_join
    @game = Game.quick_join
    render json: @game
  end

  def players
    @game = Game.find(params[:id])
    render json: @game.players
  end
end
