Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :games, only: [:index, :create]
  resources :players, only: [:index, :create]
  resources :answers, only: [:index, :create]
  resources :votes, only: [:index, :create]
  mount ActionCable.server => '/cable'
end

