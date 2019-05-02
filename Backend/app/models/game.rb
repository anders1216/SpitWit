class Game < ApplicationRecord
  has_many :players, :prompts
end
