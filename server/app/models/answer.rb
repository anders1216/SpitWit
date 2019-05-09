class Answer < ApplicationRecord
  belongs_to :player
  belongs_to :round
  has_many :votes, :dependent => :delete_all
end
