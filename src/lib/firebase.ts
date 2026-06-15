import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyARELXNnoV7DJaj7aGWWupVnBSjE6NIz00",
  authDomain: "neuromarketing-seminar.firebaseapp.com",
  projectId: "neuromarketing-seminar",
  storageBucket: "neuromarketing-seminar.firebasestorage.app",
  messagingSenderId: "783041998770",
  appId: "1:783041998770:web:6fbc61d0b1b2e5241afeab",
  databaseURL: "https://neuromarketing-seminar-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const database = getDatabase(app);

export { app, database };
