import React, { Component } from "react";

class UserView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div>Hi {this.props.user}</div>;
  }
}

export default UserView;
