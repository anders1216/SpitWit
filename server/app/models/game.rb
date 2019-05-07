class Game < ApplicationRecord
  has_many :players
  has_many :rounds

  # Create prompts and assign them to players for rounds
  def create_rounds
    player_prompts = {}
    prompts = Prompt.all.sample(game.players.length)
    
    prompts.each_with_index do |prompt, i|
      Round.create(prompt_id: prompt.id, round_number: i+1, game_id: game.id)
      player_prompts[game.players[i].id] ||= []
      player_prompts[game.players[i].id] << prompt[:question]
      if(i+1 == prompts.length)
        player_prompts[game.players[0].id] << prompt[:question]
      else
        player_prompts[game.players[i+1].id] ||= []
        player_prompts[game.players[i+1].id] << prompt[:question]
      end
    end

    return player_prompts
  end

  # Generate random 4-letter code 
  def self.generate_room_code 
    ('A'..'Z').to_a.sample(4).join
  end

end
