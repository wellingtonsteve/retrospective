import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

class LoginView extends Component {
  constructor(props) {
    super(props);
    this.state = { nameValue: "" };
  }

  setName = name => this.setState({ nameValue: name });

  render() {
    return (
      <div>
        <Form
          onSubmit={event => {
            event.preventDefault();
            event.stopPropagation();
            const providedName = this.state.nameValue.trim();
            const lowerName = providedName.toLowerCase();
            const titleName =
              lowerName.charAt(0).toUpperCase() + lowerName.slice(1);
            this.props.loginAction(titleName);
          }}
        >
          <Form.Group controlId="username">
            <Form.Label>Enter your name</Form.Label>
            <Form.Control
              value={this.state.nameValue}
              onChange={event => this.setName(event.target.value)}
              type="text"
              size="lg"
              placeholder="Name"
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}

export default LoginView;
