class GamesController < ApplicationController

  def create
    @game = Player.create(params[:player])
    render json: @game
  end

end
