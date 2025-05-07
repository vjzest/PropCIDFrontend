// firebaseClient.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx", // Replace this with your actual Firebase API key
  authDomain: "propcid-f2c8d.firebaseapp.com",
  projectId: "propcid-f2c8d",
  storageBucket: "propcid-f2c8d.firebasestorage.app",
  messagingSenderId: "579491551162",
  appId: "1:579491551162:web:85a468badeca95aa2fef83",
  measurementId: "G-NY4S1WCRD5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
