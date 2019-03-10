import React, { Component } from "react";
import "./App.css";
import firebase from "./firebase.js";
import ScreenView from "./ScreenView.js";
import UserView from "./UserView";

const users = ["Liljana", "Cameron", "Matt", "Layne", "Steve", "Alan", "James"];

const loginToApp = initials => {
  const db = firebase.firestore();
  return db
    .collection("retros")
    .doc("questions")
    .update({
      people: firebase.firestore.FieldValue.arrayUnion(initials)
    });
};

const Start = ({ screenViewAction, loginAction }) => (
  <div>
    <div className="userlist">
      <h1>Choose your name</h1>
      {users.map(user => (
        <button key={user} onClick={() => loginAction(user)}>
          {user}
        </button>
      ))}
    </div>
  </div>
);

class App extends Component {
  constructor(props) {
    super(props);
    this.db = firebase.firestore();
    const firstPage = window.location.search.includes("screenview")
      ? "screenview"
      : "start";
    this.state = {
      page: firstPage,
      name: null,
      people: []
    };
  }

  componentDidMount = () => {
    this.db
      .collection("retros")
      .doc("questions")
      .onSnapshot(questions => {
        const people = questions.data().people;
        this.setState({
          people: people
        });
      });
  };

  goToScreenView = () => {
    this.setState({
      page: "screenview"
    });
  };

  login = initials => {
    loginToApp(initials).then(() =>
      this.setState({
        page: "userview",
        name: initials
      })
    );
  };

  render() {
    if (this.state.page === "start" || this.userWasBooted()) {
      return (
        <div className="App">
          <Start
            screenViewAction={this.goToScreenView}
            loginAction={this.login}
          />
        </div>
      );
    } else if (this.state.page === "screenview") {
      return (
        <div className="App">
          <ScreenView />
        </div>
      );
    } else {
      return (
        <div className="App">
          <UserView user={this.state.name} />
        </div>
      );
    }
  }

  userWasBooted = () =>
    this.state.page === "userview" &&
    !this.state.people.includes(this.state.name);
}

export default App;
