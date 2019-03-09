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
      <UserWaitingScreen
        user={this.props.user}
        peopleCount={this.state.people.length}
      />
    );
  }
}

const UserWaitingScreen = ({ user, peopleCount }) => (
  <div>
    <h1>Hi {user}</h1>
    <h2>
      {peopleCount} {peopleCount === 1 ? "person" : "people"} here
    </h2>
    <h2>Waiting for retro to start...</h2>
  </div>
);

export default UserView;
