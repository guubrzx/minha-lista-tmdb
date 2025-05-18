// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCm51qwi1_-0mTCZlgBZO0-GP-f6C6iKCA",
  authDomain: "intrepid-craft-455314-r3.firebaseapp.com",
  projectId: "intrepid-craft-455314-r3",
  storageBucket: "intrepid-craft-455314-r3.firebasestorage.app",
  messagingSenderId: "738300752941",
  appId: "1:738300752941:web:fe38f862bd5b74b6c1f4a4",
  measurementId: "G-CK4QDFX83R"
};

const app = initializeApp(firebaseConfig);
getAnalytics(app); // opcional

export const db = getFirestore(app);
