import LocationCode from "./LocationCode.js";
import React from "react";
import FontAwesome from "react-fontawesome";
import Jumbotron from "react-bootstrap/Jumbotron";
import Carousel from "react-bootstrap/Carousel";
import Badge from "react-bootstrap/Badge";

const variantMap = ["danger", "danger", "warning", "success", "success"];

const ScreenView = ({ databaseState, switchToQuestionAction }) =>
  databaseState.currentQuestion < 0 ? (
    <ScreenWaitingView people={databaseState.people} />
  ) : (
    <QuestionsView
      databaseState={databaseState}
      switchToQuestionAction={switchToQuestionAction}
    />
  );

const ScreenWaitingView = ({ people }) => (
  <div>
    {people.length === 0 ? (
      <Jumbotron>
        <h1>No one here yet</h1>
      </Jumbotron>
    ) : (
      <Jumbotron>
        <h1>
          {people.length} {people.length === 1 ? "person" : "people"} here:
        </h1>
        <p>
          {people.map(userName => (
            <ScreenUserTag key={userName} userName={userName} />
          ))}
        </p>
      </Jumbotron>
    )}
    <LocationCode />
  </div>
);

const VotePill = ({ score }) => (
  <span>
    <Badge
      pill
      style={{ fontSize: "150%", margin: "1px" }}
      variant={variantMap[score - 1]}
    >
      {score}
    </Badge>
  </span>
);

const hasEveryoneVoted = (people, votes, currentQuestionIndex) =>
  peopleWhoHaveNotVoted(people, votes, currentQuestionIndex).length === 0;

const peopleWhoHaveNotVoted = (people, votes, currentQuestionIndex) => {
  const voteUsers = votes
    .filter(vote => vote.question === currentQuestionIndex)
    .map(vote => vote.name);
  return people.filter(person => !voteUsers.includes(person));
};

const QuestionsView = ({
  databaseState: {
    currentQuestion,
    currentScrollDirection,
    people,
    questions,
    votes
  },
  switchToQuestionAction
}) => {
  const ScoreRow = ({ score }) => {
    return (
      <tr style={{ height: "40px" }}>
        {questions.map((question, index) => (
          <td
            key={index}
            style={{
              background: "white",
              borderWidth: "2px"
            }}
          >
            {hasEveryoneVoted(people, votes, index) ? (
              <span>
                {votes
                  .filter(
                    vote => vote.question === index && vote.score === score
                  )
                  .map(vote => (
                    <VotePill key={vote.name} score={vote.score} />
                  ))}
                <span>​</span>
                {/* There's a zero width space there to make sure the row keeps its line height */}
              </span>
            ) : currentQuestion === index ? (
              <FontAwesome
                style={{ fontSize: "150%" }}
                className="rotating"
                name="spinner"
              />
            ) : (
              <span>
                <span>​</span>
                {/* There's a zero width space there to make sure the row keeps its line height */}
              </span>
            )}
          </td>
        ))}
      </tr>
    );
  };

  return (
    <div>
      <Jumbotron
        style={{
          padding: "10px",
          marginBottom: "10px",
          background: "darkgray"
        }}
      >
        <table
          // border="1"
          style={{
            borderWidth: "2px",
            width: "100%",
            tableLayout: "fixed",
            borderCollapse: "separate"
          }}
        >
          <tbody>
            <ScoreRow score={5} />
            <ScoreRow score={4} />
            <ScoreRow score={3} />
            <ScoreRow score={2} />
            <ScoreRow score={1} />
            <tr>
              {questions.map((question, index) => (
                <td
                  key={index}
                  style={{
                    borderWidth: "2px",
                    verticalAlign: "center",
                    padding: "5px",
                    background: "#" + question.colour,
                    fontSize: "110%",
                    fontWeight: currentQuestion === index ? "bold" : "normal",
                    textAlign: "center"
                  }}
                >
                  {question.heading}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </Jumbotron>
      <Carousel
        activeIndex={currentQuestion}
        direction={currentScrollDirection}
        onSelect={switchToQuestionAction}
        interval={null}
        controls={false}
        indicators={true}
      >
        {questions.map((question, index) => (
          <Carousel.Item key={index}>
            <Jumbotron
              style={{
                background: "#" + question.colour,
                padding: "20px",
                marginBottom: "50px"
              }}
            >
              <div style={{ width: "70%", margin: "auto" }}>
                <h1>{question.heading}</h1>
                <h2>{question.subheading}</h2>
                <p style={{ fontSize: "110%" }}>
                  {question.examples.map((example, index) => (
                    <span key={index}>
                      <i>{example}</i>
                      <br />
                    </span>
                  ))}
                </p>
                {peopleWhoHaveNotVoted(people, votes, index).length ===
                0 ? null : (
                  <p>
                    Waiting for votes from:{" "}
                    <b>
                      {peopleWhoHaveNotVoted(people, votes, index).join(", ")}
                    </b>
                  </p>
                )}
              </div>
            </Jumbotron>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

const ScreenUserTag = ({ userName }) => (
  <Badge
    style={{ marginRight: "5px", fontSize: "150%" }}
    pill
    variant="primary"
  >
    <span style={{ margin: "5px" }}>{userName}</span>{" "}
  </Badge>
);

export default ScreenView;
