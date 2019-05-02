class CreateVotes < ActiveRecord::Migration[5.2]
  def change
    create_table :votes do |t|
      t.player_id :integer
      t.answer_id :integer

      t.timestamps
    end
  end
end
