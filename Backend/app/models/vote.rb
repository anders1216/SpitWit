class Vote < ApplicationRecord
  belongs_to :question, :player
end
