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

const LocationCode = () => (
  <div>
    <br />
    <QRCode size={300} value={window.location.href} />
    <br />
    <h1>{window.location.href.replace(window.location.search, "")}</h1>
  </div>
);

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

class ScreenWaitingView extends Component {
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

  bootUser = userName => {
    this.db
      .collection("retros")
      .doc("questions")
      .update({
        people: firebase.firestore.FieldValue.arrayRemove(userName)
      });
  };

  render() {
    return (
      <div>
        {this.state.people.length === 0 ? (
          <h1>No one here yet</h1>
        ) : (
          <div>
            <h1>
              {this.state.people.length}{" "}
              {this.state.people.length === 1 ? "person" : "people"} here:
            </h1>
            <h2>
              {this.state.people.map(userName => (
                <ScreenUserTag
                  userName={userName}
                  bootAction={() => this.bootUser(userName)}
                />
              ))}
            </h2>
          </div>
        )}
        <LocationCode />
      </div>
    );
  }
}

const ScreenUserTag = ({ userName, bootAction }) => (
  <span>
    {userName}
    <button onClick={bootAction}>❌</button>{" "}
  </span>
);

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
          <ScreenWaitingView />
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
