import React from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";
import FontAwesome from "react-fontawesome";
import Carousel from "react-bootstrap/Carousel";

const variantMap = ["danger", "danger", "warning", "success", "success"];

const UserView = ({ databaseState, name, recordVoteAction }) =>
  databaseState.currentQuestion === -1 ? (
    <UserWaitingScreen name={name} peopleCount={databaseState.people.length} />
  ) : (
    <QuestionView
      databaseState={databaseState}
      name={name}
      recordVoteAction={recordVoteAction}
    />
  );

const UserWaitingScreen = ({ name, peopleCount }) => (
  <Jumbotron>
    <h1>Hi {name}</h1>
    <p>
      {peopleCount} {peopleCount === 1 ? "person" : "people"} here
    </p>
    <p>Waiting for retro to start...</p>
  </Jumbotron>
);

const QuestionView = ({ databaseState, name, recordVoteAction }) => {
  const {
    currentQuestion,
    currentScrollDirection,
    questions,
    votes
  } = databaseState;

  return (
    <Carousel
      activeIndex={currentQuestion}
      direction={currentScrollDirection}
      interval={null}
      controls={false}
      indicators={false}
      onSelect={() => {}}
    >
      {questions.map((question, index) => {
        const myVotes = votes.filter(
          vote => vote.name === name && vote.question === index
        );

        const VoteButton = ({ buttonScore }) => (
          <Button
            variant={variantMap[buttonScore - 1]}
            size="lg"
            block
            disabled={myVotes.length > 0}
            onClick={() => recordVoteAction(name, buttonScore, index)}
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
              <VoteButton buttonScore={5} />
              <VoteButton buttonScore={4} />
              <VoteButton buttonScore={3} />
              <VoteButton buttonScore={2} />
              <VoteButton buttonScore={1} />
            </div>
          </Carousel.Item>
        );
      })}
    </Carousel>
  );
};

export default UserView;
