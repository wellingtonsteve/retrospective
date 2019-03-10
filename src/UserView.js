import React, { Component } from "react";
import firebase from "./firebase";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";
import FontAwesome from "react-fontawesome";
import Carousel from "react-bootstrap/Carousel";

class UserView extends Component {
  constructor(props) {
    super(props);
    this.db = firebase.firestore();
    this.state = {
      currentQuestion: -1,
      people: [],
      questions: [],
      votes: []
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
  <Jumbotron>
    <h1>Hi {user}</h1>
    <p>
      {peopleCount} {peopleCount === 1 ? "person" : "people"} here
    </p>
    <p>Waiting for retro to start...</p>
  </Jumbotron>
);

class QuestionView extends Component {
  constructor(props) {
    super(props);
    this.db = firebase.firestore();
  }

  render = () => {
    const {
      questionState: {
        currentQuestion,
        currentScrollDirection,
        questions,
        votes
      },
      user
    } = this.props;

    const voteAction = (score, questionIndex) => {
      this.db
        .collection("retros")
        .doc("questions")
        .update({
          votes: firebase.firestore.FieldValue.arrayUnion({
            user: user,
            score: score,
            question: questionIndex
          })
        });
      // TODO: disable buttons while persisting vote?
    };

    return (
      <Carousel
        activeIndex={currentQuestion}
        direction={currentScrollDirection}
        interval={null}
        controls={false}
        indicators={false}
      >
        {questions.map((question, index) => {
          const myVotes = votes.filter(
            vote => vote.user === user && vote.question === index
          );

          const VoteButton = ({ buttonScore }) => (
            <Button
              size="lg"
              block
              disabled={myVotes.length > 0}
              onClick={() => voteAction(buttonScore, index)}
            >
              {buttonScore}
              {myVotes.length > 0 && myVotes[0].score === buttonScore ? (
                <FontAwesome name="check" />
              ) : null}
            </Button>
          );
          return (
            <Carousel.Item key={index}>
              <Jumbotron style={{ background: "#" + question.colour }}>
                <h1>{question.heading}</h1>
                <h2>{question.subheading}</h2>
                <p>
                  {question.examples.map((example, index) => (
                    <span key={index}>
                      <i>{example}</i>
                      <br />
                    </span>
                  ))}
                </p>
              </Jumbotron>
              <div>
                <VoteButton buttonScore={1} />
                <VoteButton buttonScore={2} />
                <VoteButton buttonScore={3} />
                <VoteButton buttonScore={4} />
                <VoteButton buttonScore={5} />
              </div>
            </Carousel.Item>
          );
        })}
      </Carousel>
    );
  };
}

export default UserView;
