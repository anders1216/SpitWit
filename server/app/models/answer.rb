class Answer < ApplicationRecord
  belongs_to :player
  has_many :votes
end
