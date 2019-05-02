class Game < ApplicationRecord
  has_many :players, :prompts

  # Generate random 4-letter code 
  def self.generate_room_code 
    ('A'..'Z').to_a.shuffle[0,4].join
  end

end
