class Prompt < ApplicationRecord
  has_many :answers
  has_one :round
end
