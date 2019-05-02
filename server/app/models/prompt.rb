class Prompt < ApplicationRecord
  has_many :answers
  belongs_to :game
  has_one :round
end
