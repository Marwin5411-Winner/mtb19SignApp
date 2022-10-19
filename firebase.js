// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBuS7zf5lbbAQzfiSj3t6TgWyq5vSkmY30",
  authDomain: "signpdf-e962e.firebaseapp.com",
  projectId: "signpdf-e962e",
  storageBucket: "signpdf-e962e.appspot.com",
  messagingSenderId: "171141141254",
  appId: "1:171141141254:web:f0aaaf7586593142fdc487",
  measurementId: "G-CTCK3J7RPB"
};

// Initialize Firebase
const fbapp = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

module.exports = fbapp;