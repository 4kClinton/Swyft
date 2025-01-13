// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import firebase from 'firebase/app';
import 'firebase/database';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD3UOJEpimIg7F9gGtOF_LdoXQoWc-7rqg",
  authDomain: "swyft-ca43e.firebaseapp.com",
  projectId: "swyft-ca43e",
  storageBucket: "swyft-ca43e.firebasestorage.app",
  messagingSenderId: "474475564210",
  appId: "1:474475564210:web:334c733b7f4b6b3d784dab",
  measurementId: "G-WFN6CLV1N3"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  

const database = firebase.database();

export { database };