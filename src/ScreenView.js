import firebase from "./firebase";
import LocationCode from "./LocationCode.js";
import React, { Component } from "react";

class ScreenView extends Component {
  constructor(props) {
    super(props);
    this.db = firebase.firestore();
    this.state = {
      currentQuestion: -1,
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

  render = () =>
    this.state.currentQuestion === -1 ? (
      <ScreenWaitingView people={this.state.people} bootUser={this.bootUser} />
    ) : (
      <QuestionsView questionState={this.state} />
    );
}

const ScreenWaitingView = ({ people, bootUser }) => (
  <div>
    {people.length === 0 ? (
      <h1>No one here yet</h1>
    ) : (
      <div>
        <h1>
          {people.length} {people.length === 1 ? "person" : "people"} here:
        </h1>
        <h2>
          {people.map(userName => (
            <ScreenUserTag
              userName={userName}
              bootAction={() => bootUser(userName)}
            />
          ))}
          <br />
          <button>Start</button>
        </h2>
      </div>
    )}
    <br />
    <LocationCode />
  </div>
);

const QuestionsView = ({ questionState }) => <div>Ok started</div>;

const ScreenUserTag = ({ userName, bootAction }) => (
  <span>
    {userName}
    <button onClick={bootAction}>❌</button>{" "}
  </span>
);

export default ScreenView;
