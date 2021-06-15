import firebase from "firebase";
import "firebase/firebase-firestore";
import "firebase/auth";

export type FirebaseUser = firebase.User;

const firebaseConfig = {
  apiKey: "AIzaSyCRJHPxQ1VtFBC7KtmdRd3CftLmw6qb8fw",
  authDomain: "whosapp-28db7.firebaseapp.com",
  projectId: "whosapp-28db7",
  storageBucket: "whosapp-28db7.appspot.com",
  messagingSenderId: "40933235063",
  appId: "1:40933235063:web:145acafa5e484769e92972",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();

export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
