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
      <QuestionView questionState={this.state} user={this.props.user} />
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

class QuestionView extends Component {
  constructor(props) {
    super(props);
    this.db = firebase.firestore();
    this.state = {
      votes: []
    };
  }

  componentDidMount = () => {
    this.db
      .collection("retros")
      .doc("questions")
      .onSnapshot(questions => {
        this.setState({
          votes:
            questions.data().votes === undefined ? [] : questions.data().votes
        });
      });
  };

  render = () => {
    const {
      questionState: { currentQuestion, questions },
      user
    } = this.props;

    const question = questions[currentQuestion];

    const voteAction = score => {
      this.db
        .collection("retros")
        .doc("questions")
        .update({
          votes: firebase.firestore.FieldValue.arrayUnion({
            user: user,
            score: score,
            question: currentQuestion
          })
        });
      // TODO: disable buttons while persisting vote?
    };

    const myVotes = this.state.votes.filter(
      vote => vote.user === user && vote.question === currentQuestion
    );

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
        <div>
          <button
            disabled={myVotes.length > 0}
            onClick={() => voteAction(1)}
            className="voteButton"
            style={{
              border:
                myVotes.length > 0 && myVotes[0].score === 1
                  ? "2px solid red"
                  : "1px solid black"
            }}
          >
            1
          </button>
          <button
            disabled={myVotes.length > 0}
            onClick={() => voteAction(2)}
            className="voteButton"
            style={{
              border:
                myVotes.length > 0 && myVotes[0].score === 2
                  ? "2px solid red"
                  : "1px solid black"
            }}
          >
            2
          </button>
          <button
            disabled={myVotes.length > 0}
            onClick={() => voteAction(3)}
            className="voteButton"
            style={{
              border:
                myVotes.length > 0 && myVotes[0].score === 3
                  ? "2px solid red"
                  : "1px solid black"
            }}
          >
            3
          </button>
          <button
            disabled={myVotes.length > 0}
            onClick={() => voteAction(4)}
            className="voteButton"
            style={{
              border:
                myVotes.length > 0 && myVotes[0].score === 4
                  ? "2px solid red"
                  : "1px solid black"
            }}
          >
            4
          </button>
          <button
            disabled={myVotes.length > 0}
            onClick={() => voteAction(5)}
            className="voteButton"
            style={{
              border:
                myVotes.length > 0 && myVotes[0].score === 5
                  ? "2px solid red"
                  : "1px solid black"
            }}
          >
            5
          </button>
        </div>
      </div>
    );
  };
}

export default UserView;
