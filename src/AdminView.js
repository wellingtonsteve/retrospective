import firebase from "./firebase";
import React, { Component } from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";

class AdminView extends Component {
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
        this.setState({ votes: [], ...questions.data() });
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

  bootAll = () => {
    this.db
      .collection("retros")
      .doc("questions")
      .update({
        people: []
      });
  };

  deleteVote = vote => {
    this.db
      .collection("retros")
      .doc("questions")
      .update({
        votes: firebase.firestore.FieldValue.arrayRemove(vote)
      });
  };

  deleteVotes = votes => {
    this.db
      .collection("retros")
      .doc("questions")
      .update({
        votes: firebase.firestore.FieldValue.arrayRemove(...votes)
      });
  };

  fullReset = () => {
    this.db
      .collection("retros")
      .doc("questions")
      .update({
        currentQuestion: -1,
        currentScrollDirection: null,
        people: [],
        votes: []
      });
  };

  handleSelect = (selectedIndex, scrollDirection) => {
    this.db
      .collection("retros")
      .doc("questions")
      .update({
        currentQuestion: selectedIndex,
        currentScrollDirection: scrollDirection
      });
  };

  render = () => (
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
                onClick={() => this.handleSelect(-1, null)}
                style={{ margin: "1px" }}
              >
                Waitscreen
              </Button>
              <br />
              <Button
                onClick={() =>
                  this.handleSelect(this.state.currentQuestion - 1, "prev")
                }
                style={{ margin: "1px" }}
              >
                &lt;
              </Button>
              <Button
                onClick={() =>
                  this.handleSelect(this.state.currentQuestion + 1, "next")
                }
                style={{ margin: "1px" }}
              >
                &gt;
              </Button>
              <Button variant="danger" onClick={this.fullReset}>
                FULL RESET
              </Button>
            </td>
            {this.state.questions.map((question, index) => (
              <td
                key={index}
                style={{
                  borderWidth: "2px",
                  verticalAlign: "top",
                  padding: "5px",
                  background: "#" + question.colour,
                  fontSize: "110%",
                  textAlign: "center",
                  fontWeight:
                    this.state.currentQuestion === index ? "bold" : "normal"
                }}
              >
                <Button onClick={() => this.handleSelect(index, "prev")}>
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
          {this.state.people.map(person => (
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
                <Button variant="danger" onClick={() => this.bootUser(person)}>
                  {person}
                </Button>
              </td>
              {this.state.questions.map((question, index) => (
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
                  {this.state.votes
                    .filter(
                      vote => vote.question === index && vote.user === person
                    )
                    .map((vote, index) => (
                      <Button
                        key={index}
                        variant={"" + variantMap[vote.score - 1]}
                        onClick={() => this.deleteVote(vote)}
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
                    this.deleteVotes(
                      this.state.votes.filter(vote => vote.user === person)
                    )
                  }
                >
                  {this.state.votes
                    .filter(vote => vote.user === person)
                    .reduce((acc, vote) => acc + vote.score, 0)}
                  <span style={{ fontSize: "80%" }}>
                    /{this.state.questions.length * 5}
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
              <Button onClick={this.bootAll} variant="danger">
                {this.state.people.length}
              </Button>
            </td>
            {this.state.questions.map((question, index) => (
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
                    this.deleteVotes(
                      this.state.votes.filter(vote => vote.question === index)
                    )
                  }
                  variant="danger"
                >
                  {this.state.votes
                    .filter(vote => vote.question === index)
                    .reduce((acc, vote) => acc + vote.score, 0)}
                  <span style={{ fontSize: "80%" }}>
                    /{this.state.people.length * 5}
                  </span>
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
              <Button
                onClick={() => this.deleteVotes(this.state.votes)}
                variant="danger"
              >
                {this.state.votes.reduce((acc, vote) => acc + vote.score, 0)}
                <span style={{ fontSize: "80%" }}>
                  /{this.state.people.length * this.state.questions.length * 5}
                </span>
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </Jumbotron>
  );
}

const variantMap = ["danger", "danger", "warning", "success", "success"];

export default AdminView;
