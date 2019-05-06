class Game < ApplicationRecord
  has_many :players
  has_many :rounds

  # Generate random 4-letter code 
  def self.generate_room_code 
    ('A'..'Z').to_a.sample(4).join
  end

end
