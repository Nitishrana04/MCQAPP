// src/firebase.js
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAXHa8XGZ8Oh8LEf7mR_s8yMfG6M8ajETY",
  authDomain: "mcqapp-92203.firebaseapp.com",
  databaseURL: "https://mcqapp-92203-default-rtdb.firebaseio.com",
  projectId: "mcqapp-92203",
  storageBucket: "mcqapp-92203.appspot.com",
  messagingSenderId: "285523418877",
  appId: "1:285523418877:web:5724f5df28b19892de2894",
  measurementId: "G-RVFXXT8VG8"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();

export { db, auth };