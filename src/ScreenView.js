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
      <ScreenWaitingView
        people={this.state.people}
        bootUser={this.bootUser}
        startAction={() =>
          this.db
            .collection("retros")
            .doc("questions")
            .update({ currentQuestion: 0 })
        }
      />
    ) : (
      <QuestionsView questionState={this.state} />
    );
}

const ScreenWaitingView = ({ people, bootUser, startAction }) => (
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
          <button onClick={startAction}>Start</button>
        </h2>
      </div>
    )}
    <br />
    <LocationCode />
  </div>
);

const QuestionsView = ({ questionState: { currentQuestion, questions } }) => (
  <div>
    <table border="1" style={{ width: "100%" }}>
      <tbody>
        <tr>
          <td>5</td>
          {questions.map((question, index) => (
            <td key={index}> </td>
          ))}
        </tr>
        <tr>
          <td>4</td>
          {questions.map((question, index) => (
            <td key={index}> </td>
          ))}
        </tr>
        <tr>
          <td>3</td>
          {questions.map((question, index) => (
            <td key={index}> </td>
          ))}
        </tr>
        <tr>
          <td>2</td>
          {questions.map((question, index) => (
            <td key={index}> </td>
          ))}
        </tr>
        <tr>
          <td>1</td>
          {questions.map((question, index) => (
            <td key={index}> </td>
          ))}
        </tr>
        <tr>
          <td />
          {questions.map((question, index) => (
            <td key={index} style={{ background: "#" + question.colour }}>
              <div>
                <strong>{question.heading}</strong>
              </div>
              <br />
              <div>
                <strong>{question.subheading}</strong>
              </div>
              {question.examples.map((example, index) => (
                <i key={index}>
                  <br />
                  {example}
                </i>
              ))}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
    <div style={{ background: "#" + questions[currentQuestion].colour }}>
      <h1>
        Question {currentQuestion + 1}: {questions[currentQuestion].heading} -{" "}
        {questions[currentQuestion].subheading}
      </h1>
      {questions[currentQuestion].examples.map((example, index) => (
        <h3 key={index}>
          <i>{example}</i>
        </h3>
      ))}
    </div>
  </div>
);

const ScreenUserTag = ({ userName, bootAction }) => (
  <span>
    {userName}
    <button onClick={bootAction}>❌</button>{" "}
  </span>
);

export default ScreenView;
