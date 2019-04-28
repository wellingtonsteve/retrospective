import firebase from "./firebase.js";

const docToUse = window.location.href.includes("localhost")
  ? "test"
  : "production";
const db = firebase.firestore();
const retroDoc = db.collection("retros").doc(docToUse);
const arrayUnion = firebase.firestore.FieldValue.arrayUnion;
const arrayRemove = firebase.firestore.FieldValue.arrayRemove;

const signInAction = () => firebase.auth().signInAnonymously();

const addSigninSectionListener = (uid, listener) =>
  retroDoc
    .collection("signins")
    .doc(uid)
    .onSnapshot(doc => listener(doc.data()));

const addAllSigninsListener = listener =>
  retroDoc.collection("signins").onSnapshot(docs => listener(docs));

const addAllPermissionedUsersListener = listener =>
  retroDoc.collection("permissionedUsers").onSnapshot(docs => listener(docs));

const addRootDatabaseListener = listener =>
  retroDoc.onSnapshot(doc => listener(doc.data()));

const loginToAppAction = (uid, name) =>
  retroDoc
    .collection("signins")
    .doc(uid)
    .set({ name, loginAcceptedHint: false });

const approveUidAction = uid =>
  retroDoc
    .collection("permissionedUsers")
    .doc(uid)
    .set({ user: true })
    .then(() =>
      retroDoc
        .collection("signins")
        .doc(uid)
        .update({ loginAcceptedHint: true })
    );

const joinRetro = person => retroDoc.update({ people: arrayUnion(person) });

const switchToQuestionAction = (selectedIndex, scrollDirection) =>
  retroDoc.update({
    currentQuestion: selectedIndex,
    currentScrollDirection: scrollDirection
  });

const recordVoteAction = (name, score, questionIndex) =>
  retroDoc.update({
    votes: arrayUnion({
      name: name,
      score: score,
      question: questionIndex
    })
  });

const bootUserAction = name => retroDoc.update({ people: arrayRemove(name) });

const bootAllUsersAction = () => retroDoc.update({ people: [] });

const deleteVoteAction = vote => retroDoc.update({ votes: arrayRemove(vote) });

const deleteVotesAction = votes =>
  retroDoc.update({ votes: arrayRemove(...votes) });

const fullResetAction = () =>
  retroDoc.update({
    currentQuestion: -1,
    currentScrollDirection: null,
    people: [],
    votes: []
  });

const archiveDataAction = () => {
  const now = new Date();
  const archiveDest =
    docToUse +
    "Archive-" +
    [
      now.getFullYear(),
      now.getMonth() + 1,
      now.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
      now.getMilliseconds()
    ].join("-");
  return retroDoc.get().then(questions => {
    retroDoc.parent
      .doc(archiveDest)
      .set(questions.data())
      .then(() => {
        alert("Archived to " + archiveDest);
      });
  });
};

export default {
  signInAction,
  addAllSigninsListener,
  addSigninSectionListener,
  addAllPermissionedUsersListener,
  addRootDatabaseListener,
  approveUidAction,
  loginToAppAction,
  joinRetro,
  switchToQuestionAction,
  recordVoteAction,
  bootUserAction,
  bootAllUsersAction,
  deleteVoteAction,
  deleteVotesAction,
  fullResetAction,
  archiveDataAction
};
