import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { GithubAuthProvider } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

// Paste in your firebaseConfig object here from firebase console (if you are using firebase)
// Note - it is best practice to put this in an env (remember to add to the gitignore) file, but not necessary.
// An example of this looks like:

const firebaseConfig = {
  apiKey: "AIzaSyB1Kz2-4QqH0fKg-Ktmt_Qu5j8aT3cLCpc",
  authDomain: "launch23-swe-week2-team4.firebaseapp.com",
  projectId: "launch23-swe-week2-team4",
  storageBucket: "launch23-swe-week2-team4.appspot.com",
  messagingSenderId: "502003416964",
  appId: "1:502003416964:web:c1016b4ff86d56d8dd27d1",
};

// Uncomment the lines below if you are using firebase

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);


export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
export default app;
