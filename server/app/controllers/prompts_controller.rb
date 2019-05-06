class PromptsController < ApplicationController
  def index
    @prompt = Prompt.all
    render json: @prompt
  end
end
