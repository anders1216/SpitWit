Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :games, only: [:index, :create, :update]
  resources :players, only: [:index, :create, :update]
  resources :answers, only: [:index, :create, :update]
  resources :votes, only: [:index, :create, :update]
  mount ActionCable.server => '/cable'
end

