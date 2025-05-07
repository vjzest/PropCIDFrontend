// firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithCustomToken, // ✅ Add this
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCoI4Lk6YeGVONPDHiE49sxgt1KQp_Tm0Y",
  authDomain: "propcid-f2c8d.firebaseapp.com",
  projectId: "propcid-f2c8d",
  storageBucket: "propcid-f2c8d.firebasestorage.app",
  messagingSenderId: "579491551162",
  appId: "1:579491551162:web:85a468badeca95aa2fef83",
  measurementId: "G-NY4S1WCRD5",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithCustomToken, // ✅ Add this
};
