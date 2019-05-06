class Player < ApplicationRecord
  belongs_to :game
  has_many :answers
  has_many :votes
end
