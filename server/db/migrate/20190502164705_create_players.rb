class CreatePlayers < ActiveRecord::Migration[5.2]
  def change
    create_table :players do |t|
      t.string :name
      t.integer :score
      t.boolean :is_host

      t.timestamps
    end
  end
end
