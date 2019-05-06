class PlayersController < ApplicationController
  def index
    @players = Player.all
    render json: @players
  end
 
  def create

    @player = Player.create(player_params)
    render json: @player
  end

  def update
    @player = Player.find(params[:id])
    @player.update(player_params)

    if @player.save
      ActionCable.server.broadcast('players', {id: @player.id, name: @player.name, is_host: @player.is_host, score: @player.score, game_id:@player.game_id})
      render json: @player, status: :accepted
    else
      render json: { errors: @player.errors.full_messages }, status: :unprocessible_entity
    end
  end
  
  private
  
  def player_params
    params.require(:player).permit!
  end 
end
