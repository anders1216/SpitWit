class PlayersController < ApplicationController
  def index
    @players = Player.all
    render json: @players
  end

  def create
    game = Game.find(player_params[:game_id])
    return if game.players.size == 8 # Max number of players

    @player = Player.create(player_params)

    ActionCable.server.broadcast("game-#{player_params[:game_id]}:players", Game.find(player_params[:game_id]).players)
    render json: @player
  end

  private

  def player_params
    params.require(:player).permit!
  end
end
