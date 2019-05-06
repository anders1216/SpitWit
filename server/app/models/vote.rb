class Vote < ApplicationRecord
  belongs_to :answer
  belongs_to :player
end
