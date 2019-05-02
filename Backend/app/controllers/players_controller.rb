class PlayersController < ApplicationController

  def create
    @player = Player.create(params[:player])
    render json: @player
  end

   
end
