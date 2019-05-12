class Game < ApplicationRecord
  has_many :players, :dependent => :delete_all
  has_many :rounds, :dependent => :delete_all

  # Create prompts and assign them to players for rounds
  def create_rounds
    player_prompts = {}
    total_rounds = self.players.length*2
    prompts = Prompt.all.sample(total_rounds)

    # Randomize rounds
    round_numbers = (1..total_rounds).to_a.shuffle

    prompts.each_with_index do |prompt, i|
      round_number = round_numbers[i]
      round = Round.create!(prompt_id: prompt.id, round_number: round_number, game_id: self.id)
      i -= self.players.size if i > self.players.size - 1

      player_prompts[self.players[i].id] ||= []
      player_prompts[self.players[i].id] << {prompt: prompt[:question], round_number: round_number, round_id: round.id}

      if(i+1 == prompts.length/2)
        player_prompts[self.players[0].id] << {prompt: prompt[:question], round_number: round_number, round_id: round.id}
      else
        player_prompts[self.players[i+1].id] ||= []
        player_prompts[self.players[i+1].id] << {prompt: prompt[:question], round_number: round_number, round_id: round.id}
      end
    end
    
    return player_prompts
  end

  def get_best_answer 
    answers = []
    self.rounds.each do |round|
      answers << round.answers.max_by{|answer| answer.votes.size}
    end

    return answers.flatten.max_by{|answer| answer ? answer.votes.size : 0}
  end

  def self.quick_join
    games = Game.all.to_a
    game = nil

    while (!game && games.last)
      if (games.last.round_number === 0 && games.last.rounds.size === 0)
        game = games.last 
      end

      games.pop()
    end

    return game
  end

  # Generate random 4-letter code
  def self.generate_room_code
    ('A'..'Z').to_a.sample(4).join
  end

end
