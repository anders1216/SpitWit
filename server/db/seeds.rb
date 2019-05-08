# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

require_relative "prompts_data"

PromptsDB.data.each {|p| Prompt.find_or_create_by!(question: p[:prompt])}
# Game.create(room_code: Game.generate_room_code, round_number: 0)
