import firebase from "firebase";

const config = {
  apiKey: "AIzaSyBVCuCGKBN62hsk5_D1IPHM_kOl4I7ugh4",
  authDomain: "retrospective-f2862.firebaseapp.com",
  databaseURL: "https://retrospective-f2862.firebaseio.com",
  projectId: "retrospective-f2862",
  storageBucket: "retrospective-f2862.appspot.com",
  messagingSenderId: "1089995390667"
};
firebase.initializeApp(config);

export default firebase;
