class Round < ApplicationRecord
  belongs_to :game
  belongs_to :prompt
  has_many :answers
end
