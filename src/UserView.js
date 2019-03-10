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
      <div style={{ background: "#" + question.colour }}>
        <h1>
          Question {currentQuestion + 1}: {question.heading} -{" "}
          {question.subheading}
        </h1>
        {question.examples.map((example, index) => (
          <h3 key={index}>
            <i>{example}</i>
          </h3>
        ))}
      </div>
    </div>
  );
};

export default UserView;
