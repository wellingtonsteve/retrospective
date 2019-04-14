import React from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";

const AdminView = ({
  databaseState,
  switchToQuestionAction,
  bootUserAction,
  bootAllUsersAction,
  deleteVoteAction,
  deleteVotesAction,
  fullResetAction,
  archiveDataAction
}) => {
  const { currentQuestion, people, questions, votes } = databaseState;

  return (
    <Jumbotron
      style={{
        padding: "10px",
        marginBottom: "10px",
        background: "white"
      }}
    >
      <table
        style={{
          borderWidth: "2px",
          width: "100%",
          tableLayout: "fixed",
          borderCollapse: "separate"
        }}
      >
        <thead>
          <tr>
            <td
              style={{
                borderWidth: "2px",
                verticalAlign: "top",
                padding: "5px",
                fontSize: "110%",
                textAlign: "center"
              }}
            >
              <Button
                onClick={() => switchToQuestionAction(-1, null)}
                style={{ margin: "1px" }}
              >
                Waitscreen
              </Button>
              <br />
              <Button
                onClick={() =>
                  switchToQuestionAction(currentQuestion - 1, "prev")
                }
                style={{ margin: "1px" }}
              >
                &lt;
              </Button>
              <Button
                onClick={() =>
                  switchToQuestionAction(currentQuestion + 1, "next")
                }
                style={{ margin: "1px" }}
              >
                &gt;
              </Button>
              <Button
                variant="danger"
                onClick={fullResetAction}
                style={{ margin: "1px" }}
              >
                FULL RESET
              </Button>
              <Button
                variant="danger"
                onClick={archiveDataAction}
                style={{ margin: "1px" }}
              >
                ARCHIVE
              </Button>
            </td>
            {questions.map((question, index) => (
              <td
                key={index}
                style={{
                  borderWidth: "2px",
                  verticalAlign: "top",
                  padding: "5px",
                  background: "#" + question.colour,
                  fontSize: "110%",
                  textAlign: "center",
                  fontWeight: currentQuestion === index ? "bold" : "normal"
                }}
              >
                <Button onClick={() => switchToQuestionAction(index, "prev")}>
                  Go
                </Button>
                <br />
                {question.heading}
              </td>
            ))}
            <td
              style={{
                borderWidth: "2px",
                verticalAlign: "center",
                padding: "5px",
                fontSize: "110%",
                textAlign: "center"
              }}
            >
              Total
            </td>
          </tr>
        </thead>
        <tbody>
          {people.map(person => (
            <tr key={person}>
              <td
                style={{
                  borderWidth: "2px",
                  verticalAlign: "center",
                  padding: "5px",
                  fontSize: "110%",
                  textAlign: "center"
                }}
              >
                <Button variant="danger" onClick={() => bootUserAction(person)}>
                  {person}
                </Button>
              </td>
              {questions.map((question, index) => (
                <td
                  key={index}
                  style={{
                    borderWidth: "2px",
                    verticalAlign: "center",
                    padding: "5px",
                    fontSize: "110%",
                    textAlign: "center"
                  }}
                >
                  {votes
                    .filter(
                      vote => vote.question === index && vote.name === person
                    )
                    .map((vote, index) => (
                      <Button
                        key={index}
                        variant={"" + variantMap[vote.score - 1]}
                        onClick={() => deleteVoteAction(vote)}
                      >
                        {vote.score}
                      </Button>
                    ))}
                </td>
              ))}
              <td
                style={{
                  borderWidth: "2px",
                  verticalAlign: "center",
                  padding: "5px",
                  fontSize: "110%",
                  textAlign: "center"
                }}
              >
                <Button
                  variant="danger"
                  onClick={() =>
                    deleteVotesAction(
                      votes.filter(vote => vote.name === person)
                    )
                  }
                >
                  {votes
                    .filter(vote => vote.name === person)
                    .reduce((acc, vote) => acc + vote.score, 0)}
                  <span style={{ fontSize: "80%" }}>
                    /{questions.length * 5}
                  </span>
                </Button>
              </td>
            </tr>
          ))}
          <tr>
            <td
              style={{
                borderWidth: "2px",
                verticalAlign: "center",
                padding: "5px",
                fontSize: "110%",
                textAlign: "center"
              }}
            >
              <Button onClick={bootAllUsersAction} variant="danger">
                {people.length}
              </Button>
            </td>
            {questions.map((question, index) => (
              <td
                key={index}
                style={{
                  borderWidth: "2px",
                  verticalAlign: "center",
                  padding: "5px",
                  fontSize: "110%",
                  textAlign: "center"
                }}
              >
                <Button
                  onClick={() =>
                    deleteVotesAction(
                      votes.filter(vote => vote.question === index)
                    )
                  }
                  variant="danger"
                >
                  {votes
                    .filter(vote => vote.question === index)
                    .reduce((acc, vote) => acc + vote.score, 0)}
                  <span style={{ fontSize: "80%" }}>/{people.length * 5}</span>
                </Button>
              </td>
            ))}
            <td
              style={{
                borderWidth: "2px",
                verticalAlign: "center",
                padding: "5px",
                fontSize: "110%",
                textAlign: "center"
              }}
            >
              <Button onClick={() => deleteVotesAction(votes)} variant="danger">
                {votes.reduce((acc, vote) => acc + vote.score, 0)}
                <span style={{ fontSize: "80%" }}>
                  /{people.length * questions.length * 5}
                </span>
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </Jumbotron>
  );
};

const variantMap = ["danger", "danger", "warning", "success", "success"];

export default AdminView;
