import React, { Component } from "react";
import "./App.css";
import FirebaseWrapper from "./FirebaseWrapper.js";
import ScreenView from "./ScreenView.js";
import UserView from "./UserView";
import AdminView from "./AdminView";
import LoginView from "./LoginView";
import FontAwesome from "react-fontawesome";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      signedInUid: null,
      signInFailureError: null,
      databaseState: {
        currentQuestion: -1,
        currentScrollDirection: null,
        people: [],
        questions: [],
        votes: []
      }
    };
  }

  componentDidMount = () => {
    FirebaseWrapper.signInAction()
      .then(credentials => {
        this.setState({ signedInUid: credentials.user.uid });
        this.startListeningToDatabase();
        console.log({ credentials });
      })
      .catch(error => {
        this.setState({ signInFailureError: error });
        console.log({ error });
      });
  };

  startListeningToDatabase = () =>
    FirebaseWrapper.addDatabaseListener(databaseState =>
      this.setState({ databaseState })
    );

  render = () => {
    if (this.state.signInFailureError !== null) {
      return (
        <div key="failure">
          <p>Error creating session...</p>
          <p>{this.state.signInFailureError.message}</p>
        </div>
      );
    } else if (this.userNeedsToSignIn()) {
      return (
        <div key="waiting">
          <p>Creating session...</p>
          <FontAwesome
            style={{ fontSize: "150%" }}
            className="rotating"
            name="spinner"
          />
        </div>
      );
    } else if (window.location.search.includes("screenview")) {
      return (
        <ScreenView
          databaseState={this.state.databaseState}
          switchToQuestionAction={FirebaseWrapper.switchToQuestionAction}
        />
      );
    } else if (window.location.search.includes("adminview")) {
      return (
        <AdminView
          databaseState={this.state.databaseState}
          switchToQuestionAction={FirebaseWrapper.switchToQuestionAction}
          bootUserAction={FirebaseWrapper.bootUserAction}
          bootAllUsersAction={FirebaseWrapper.bootAllUsersAction}
          deleteVoteAction={FirebaseWrapper.deleteVoteAction}
          deleteVotesAction={FirebaseWrapper.deleteVotesAction}
          fullResetAction={FirebaseWrapper.fullResetAction}
          archiveDataAction={FirebaseWrapper.archiveDataAction}
        />
      );
    } else if (this.userNeedsToLogin()) {
      return <LoginView loginAction={this.login} />;
    } else {
      return (
        <UserView
          databaseState={this.state.databaseState}
          name={this.state.name}
          recordVoteAction={FirebaseWrapper.recordVoteAction}
        />
      );
    }
  };

  userNeedsToSignIn = () => this.state.signedInUid === null;

  userNeedsToLogin = () =>
    !this.state.databaseState.people.includes(this.state.name);

  login = person =>
    FirebaseWrapper.loginToAppAction(person).then(() => this.loggedIn(person));

  loggedIn = person => this.setState({ name: person });
}

export default App;
