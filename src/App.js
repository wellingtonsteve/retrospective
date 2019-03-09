import React, { Component } from "react";
import "./App.css";
import firebase from "./firebase.js";
import QRCode from "qrcode.react";

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
    <button onClick={screenViewAction}>Screen view</button>
    <div>
      <br />
      <QRCode size={300} value={window.location.href} />
      <br />
      {window.location.href}
    </div>
  </div>
);

class ScreenView extends Component {
  render() {
    return <div>Hi</div>;
  }
}

class UserView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div>Hi {this.props.user}</div>;
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "start"
    };
  }

  goToScreenView = () => {
    this.setState({
      page: "screenview"
    });
  };

  login = initials => {
    loginToApp(initials).then(() =>
      this.setState({
        page: initials
      })
    );
  };

  render() {
    if (this.state.page === "start") {
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
          <UserView user={this.state.page} />
        </div>
      );
    }
  }
}

export default App;
