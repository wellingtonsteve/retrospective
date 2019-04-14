import React, { Component } from "react";
import "./App.css";
import FirebaseWrapper from "./FirebaseWrapper.js";
import ScreenView from "./ScreenView.js";
import UserView from "./UserView";
import AdminView from "./AdminView";
import LoginView from "./LoginView";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      databaseState: {
        currentQuestion: -1,
        currentScrollDirection: null,
        people: [],
        questions: [],
        votes: []
      }
    };
  }

  componentDidMount = () =>
    FirebaseWrapper.addDatabaseListener(databaseState =>
      this.setState({ databaseState })
    );

  render = () => {
    if (window.location.search.includes("screenview")) {
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

  userNeedsToLogin = () =>
    !this.state.databaseState.people.includes(this.state.name);

  login = person =>
    FirebaseWrapper.loginToAppAction(person).then(() => this.loggedIn(person));

  loggedIn = person => this.setState({ name: person });
}

export default App;
