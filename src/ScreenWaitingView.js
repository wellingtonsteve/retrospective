import firebase from "./firebase";
import LocationCode from "./LocationCode.js";
import React, { Component } from "react";

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
        <br />
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

export default ScreenWaitingView;
