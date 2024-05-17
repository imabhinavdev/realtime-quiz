// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getDatabase } from "firebase/database";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCR-023FxaVaoH-gsh7-5QViu_f6iXYlpA",
  authDomain: "realtimequiz-fb83d.firebaseapp.com",
  projectId: "realtimequiz-fb83d",
  storageBucket: "realtimequiz-fb83d.appspot.com",
  messagingSenderId: "589795722591",
  appId: "1:589795722591:web:c41256f55e5d5d2c8662ea",
  databaseURL:
    "https://realtimequiz-fb83d-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
export default database;
