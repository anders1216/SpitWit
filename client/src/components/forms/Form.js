import React, { Component } from 'react'

class Form extends Component {
  state = {input: ""}

  handleChange = (e) => {this.setState({input: e.target.value})}

  render(){
  	return (
  		<div>
  			<form onSubmit={this.props.handleSubmit}>
  				<input type='text' onChange={this.handleChange} value={this.state.value} placeholder={this.props.placeholder} />
  				<button type='submit'>Submit </button>
  			</form>
        {this.props.children}
  		</div>
  	)
  }
}

export default Form
