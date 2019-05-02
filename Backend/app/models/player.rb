class Player < ApplicationRecord
  belongs_to :game
  has_many :answers, :votes
end
