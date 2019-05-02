class CreateRounds < ActiveRecord::Migration[5.2]
  def change
    create_table :rounds do |t|
      t.integer :round_number
      t.integer :game_id
      t.integer :prompt_id

      t.timestamps
    end
  end
end
