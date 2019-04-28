import React, { Component } from "react";
import "./App.css";
import ScreenView from "./ScreenView.js";
import UserView from "./UserView";
import AdminView from "./AdminView";
import LoginView from "./LoginView";
import FontAwesome from "react-fontawesome";
import FirebaseWrapper from "./FirebaseWrapper";

class App extends Component {
  constructor(props) {
    super(props);
    this.joinedYet = false;
    this.state = {
      signedInUid: null,
      signInFailureError: null,
      signInState: undefined,
      permissionedUsers: [],
      allSignIns: [],
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
        const signedInUid = credentials.user.uid;
        this.setState({ signedInUid });

        if (window.location.search.includes("screenview")) {
          FirebaseWrapper.addRootDatabaseListener(databaseState =>
            this.setState({ databaseState })
          );
        } else if (window.location.search.includes("adminview")) {
          FirebaseWrapper.addAllSigninsListener(allSignIns => {
            this.setState({
              allSignIns: allSignIns.docs.map(doc => {
                return {
                  uid: doc.id,
                  data: doc.data()
                };
              })
            });
          });
          FirebaseWrapper.addAllPermissionedUsersListener(permissionedUsers => {
            this.setState({
              permissionedUsers: permissionedUsers.docs.map(doc => {
                return {
                  uid: doc.id,
                  data: doc.data()
                };
              })
            });
          });
          FirebaseWrapper.addRootDatabaseListener(databaseState =>
            this.setState({ databaseState })
          );
        } else {
          this.startListeningToOwnSigninSection(signedInUid);
        }
        console.log({ credentials });
      })
      .catch(error => {
        this.setState({ signInFailureError: error });
        console.log({ error });
      });
  };

  startListeningToOwnSigninSection = uid =>
    FirebaseWrapper.addSigninSectionListener(uid, signInState => {
      this.setState({ signInState });
      console.log({ signInState });
      if (
        !this.joinedYet &&
        signInState !== undefined &&
        signInState.loginAcceptedHint
      ) {
        console.log("Joining retro as " + signInState.name);
        this.joinedYet = true;
        FirebaseWrapper.joinRetro(signInState.name);
        FirebaseWrapper.addRootDatabaseListener(databaseState =>
          this.setState({ databaseState })
        );
      }
    });

  render = () => {
    if (this.state.signInFailureError !== null) {
      return (
        <div key="failure">
          <p>Error creating session...</p>
          <p>{this.state.signInFailureError.message}</p>
        </div>
      );
    } else if (this.state.signedInUid === null) {
      return (
        <div key="waiting">
          <p>
            Creating session...
            <FontAwesome
              style={{ fontSize: "150%" }}
              className="rotating"
              name="spinner"
            />
          </p>
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
          allSignins={this.state.allSignIns}
          permissionedUsers={this.state.permissionedUsers}
          approveUidAction={FirebaseWrapper.approveUidAction}
          switchToQuestionAction={FirebaseWrapper.switchToQuestionAction}
          bootUserAction={FirebaseWrapper.bootUserAction}
          bootAllUsersAction={FirebaseWrapper.bootAllUsersAction}
          deleteVoteAction={FirebaseWrapper.deleteVoteAction}
          deleteVotesAction={FirebaseWrapper.deleteVotesAction}
          fullResetAction={FirebaseWrapper.fullResetAction}
          archiveDataAction={FirebaseWrapper.archiveDataAction}
        />
      );
    } else if (this.state.signInState === undefined) {
      return <LoginView loginAction={this.login} />;
    } else {
      return (
        <UserView
          databaseState={this.state.databaseState}
          signInState={this.state.signInState}
          recordVoteAction={FirebaseWrapper.recordVoteAction}
        />
      );
    }
  };

  login = name =>
    FirebaseWrapper.loginToAppAction(this.state.signedInUid, name);
}

export default App;
