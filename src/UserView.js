import React, { Component } from "react";
import firebase from "./firebase";

class UserView extends Component {
  constructor(props) {
    super(props);
    this.db = firebase.firestore();
    this.state = {
      people: [],
      questions: []
    };
  }

  componentDidMount = () => {
    this.db
      .collection("retros")
      .doc("questions")
      .onSnapshot(questions => {
        this.setState(questions.data());
      });
  };

  render() {
    return (
      <div>
        <h1>Hi {this.props.user}</h1>
        <h2>
          {this.state.people.length}{" "}
          {this.state.people.length === 1 ? "person" : "people"} here
        </h2>
        <h2>Waiting for retro to start...</h2>
      </div>
    );
  }
}

export default UserView;
