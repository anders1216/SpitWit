import React, { Component } from "react";

class Form extends Component {
  state = { input: "" };

  handleChange = e => {
    this.setState({ input: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.handleSubmit(this.state.input, this.props.name);
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <fieldset disabled={this.props.disabled}>
            <input
              name={this.props.name}
              type="text"
              onChange={this.handleChange}
              value={this.state.value}
              placeholder={this.props.placeholder}
            />
            <button type="submit">Submit </button>
          </fieldset>
        </form>
        {this.props.children}
      </div>
    );
  }
}

export default Form;
