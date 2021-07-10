import firebase from "firebase/app";
import "firebase/firestore";

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCsw3GR5FTEEEVxLSvt1crNGByphODdj6E",
    authDomain: "trivia-b4360.firebaseapp.com",
    databaseURL: "https://trivia-b4360-default-rtdb.firebaseio.com",
    projectId: "trivia-b4360",
    storageBucket: "trivia-b4360.appspot.com",
    messagingSenderId: "930786315589",
    appId: "1:930786315589:web:d444580172ee02d328c22c",
    measurementId: "G-MWB5166FE7"
};
// Initialize Firebase
const fb = firebase.initializeApp(firebaseConfig);
export const db = fb.firestore();