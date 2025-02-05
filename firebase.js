// Import the functions you need from the SDKs you need

import firebase from 'firebase/app';
import 'firebase/database';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const apiKey = import.meta.env.VITE_APIKEY
const authDomain = import.meta.VITE_AUTHDOMAIN
const projectId = import.meta.VITE_PROJECTID
const storageBucket = import.meta.VITE_STORAGEBUCKET
const messagingSenderId = import.meta.VITE_MESSAGINGSENDERID
const appId = import.meta.env.VITE_APPID
const measurementId = import.meta.env.VITE_MEASUREMENTID

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();

export { database };
