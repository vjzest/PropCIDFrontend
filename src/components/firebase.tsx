// firebase.tsx (frontend)

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithCustomToken,
  sendEmailVerification,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCoI4Lk6YeGVONPDHiE49sxgt1KQp_Tm0Y",
  authDomain: "propcid-f2c8d.firebaseapp.com",
  projectId: "propcid-f2c8d",
  storageBucket: "propcid-f2c8d.appspot.com", //corrected from ".storage.app"
  messagingSenderId: "579491551162",
  appId: "1:579491551162:web:85a468badeca95aa2fef83",
  measurementId: "G-NY4S1WCRD5",
};

//Prevent duplicate app initialization
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Export Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

export {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithCustomToken,
  sendEmailVerification
};
