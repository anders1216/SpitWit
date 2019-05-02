class CreateGames < ActiveRecord::Migration[5.2]
  def change
    create_table :games do |t|
      t.string :room_code
      t.integer :round

      t.timestamps
    end
  end
end
