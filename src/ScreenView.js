import firebase from "./firebase";
import LocationCode from "./LocationCode.js";
import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import FontAwesome from "react-fontawesome";
import Jumbotron from "react-bootstrap/Jumbotron";
import Carousel from "react-bootstrap/Carousel";

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

  handleSelect = (selectedIndex, e) => {
    console.log(e);
    this.db
      .collection("retros")
      .doc("questions")
      .update({
        currentQuestion: selectedIndex,
        currentScrollDirection: e
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
      <QuestionsView
        questionState={this.state}
        handleSelect={this.handleSelect}
      />
    );
}

const ScreenWaitingView = ({ people, bootUser, startAction }) => (
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
            <ScreenUserTag
              key={userName}
              userName={userName}
              bootAction={() => bootUser(userName)}
            />
          ))}
        </p>
        <Button size="lg" style={{ marginTop: "5px" }} onClick={startAction}>
          Start{"  "}
          <FontAwesome name="play" />
        </Button>
      </Jumbotron>
    )}
    <LocationCode />
  </div>
);

const QuestionsView = ({
  questionState: { currentQuestion, currentScrollDirection, questions },
  handleSelect
}) => (
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
    <Carousel
      activeIndex={currentQuestion}
      direction={currentScrollDirection}
      onSelect={handleSelect}
      interval={null}
      controls={false}
      indicators={true}
    >
      {questions.map((question, index) => (
        <Carousel.Item key={index}>
          <Jumbotron
            style={{ background: "#" + question.colour, marginBottom: "50px" }}
          >
            <div style={{ width: "70%", margin: "auto" }}>
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
            </div>
          </Jumbotron>
        </Carousel.Item>
      ))}
    </Carousel>
  </div>
);

const ScreenUserTag = ({ userName, bootAction }) => (
  <span style={{ margin: "3px", fontSize: "150%" }}>
    {userName}{" "}
    <Button size="sm" variant="danger" onClick={bootAction}>
      <FontAwesome name="user-minus" />
    </Button>{" "}
  </span>
);

export default ScreenView;
