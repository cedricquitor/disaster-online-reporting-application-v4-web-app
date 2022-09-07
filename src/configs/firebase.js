// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBWYBUJq2R2uudGnbctTq5I-E8OGAba-Fk",
  authDomain: "dorav4-app.firebaseapp.com",
  databaseURL: "https://dorav4-app-default-rtdb.firebaseio.com",
  projectId: "dorav4-app",
  storageBucket: "dorav4-app.appspot.com",
  messagingSenderId: "369884319647",
  appId: "1:369884319647:web:e1b75d09c6070ab7f3f7aa",
  measurementId: "G-TLGM915PM3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);

export default app;
