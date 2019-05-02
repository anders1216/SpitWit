class Prompt < ApplicationRecord
  has_many :answers
  belongs_to :game
end
