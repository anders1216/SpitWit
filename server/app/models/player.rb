class Player < ApplicationRecord
  belongs_to :game
  has_many :answers, :dependent => :delete_all
  has_many :votes, :dependent => :delete_all
end
