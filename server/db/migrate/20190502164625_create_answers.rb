class CreateAnswers < ActiveRecord::Migration[5.2]
  def change
    create_table :answers do |t|
      t.player_id :integer
      t.answer_id :integer
      t.string :text

      t.timestamps
    end
  end
end
