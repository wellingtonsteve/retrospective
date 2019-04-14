import firebase from "./firebase.js";

const docToUse = window.location.href.includes("localhost")
  ? "test"
  : "questions";
const db = firebase.firestore();
const questionsDoc = db.collection("retros").doc(docToUse);
const arrayUnion = firebase.firestore.FieldValue.arrayUnion;
const arrayRemove = firebase.firestore.FieldValue.arrayRemove;

const addDatabaseListener = listener =>
  questionsDoc.onSnapshot(questions => listener(questions.data()));

const loginToAppAction = person =>
  questionsDoc.update({ people: arrayUnion(person) });

const switchToQuestionAction = (selectedIndex, scrollDirection) =>
  questionsDoc.update({
    currentQuestion: selectedIndex,
    currentScrollDirection: scrollDirection
  });

const recordVoteAction = (name, score, questionIndex) =>
  questionsDoc.update({
    votes: arrayUnion({
      name: name,
      score: score,
      question: questionIndex
    })
  });

const bootUserAction = name =>
  questionsDoc.update({ people: arrayRemove(name) });

const bootAllUsersAction = () => questionsDoc.update({ people: [] });

const deleteVoteAction = vote =>
  questionsDoc.update({ votes: arrayRemove(vote) });

const deleteVotesAction = votes =>
  questionsDoc.update({ votes: arrayRemove(...votes) });

const fullResetAction = () =>
  questionsDoc.update({
    currentQuestion: -1,
    currentScrollDirection: null,
    people: [],
    votes: []
  });

export default {
  addDatabaseListener,
  loginToAppAction,
  switchToQuestionAction,
  recordVoteAction,
  bootUserAction,
  bootAllUsersAction,
  deleteVoteAction,
  deleteVotesAction,
  fullResetAction
};
