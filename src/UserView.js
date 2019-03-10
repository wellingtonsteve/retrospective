import React, { Component } from "react";
import firebase from "./firebase";

class UserView extends Component {
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

  render = () =>
    this.state.currentQuestion === -1 ? (
      <UserWaitingScreen
        user={this.props.user}
        peopleCount={this.state.people.length}
      />
    ) : (
      <QuestionView questionState={this.state} />
    );
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

const QuestionView = ({ questionState: { currentQuestion, questions } }) => {
  const question = questions[currentQuestion];
  return (
    <div>
      <table border="0" style={{ width: "100%" }}>
        <tbody>
          <tr>
            {questions.map((question, index) => (
              <td
                key={index}
                style={{
                  background: "#" + question.colour,
                  fontSize: index === currentQuestion ? "120%" : "100%",
                  fontWeight: index === currentQuestion ? "bold" : "100",
                  color: currentQuestion >= index ? "black" : "gray"
                }}
              >
                {index + 1}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <div style={{ background: "#" + question.colour }}>
        <div>
          <strong>{question.heading}</strong>
        </div>
        <br />
        <div>
          <strong>{question.subheading}</strong>
        </div>
        <ul>
          {question.examples.map((example, index) => (
            <li key={index}>
              <i>{example}</i>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserView;
