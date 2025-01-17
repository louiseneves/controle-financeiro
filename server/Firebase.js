import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signOut } from "firebase/auth";
import { getFirestore, addDoc, collection, doc, getDocs, setDoc, getDoc, updateDoc, query, where,onSnapshot,deleteDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBLCSsiHQWnu-xKnzA_Aabk2e0hLLaPmaE",
  authDomain: "caldizimo.firebaseapp.com",
  projectId: "caldizimo",
  storageBucket: "caldizimo.appspot.com",
  messagingSenderId: "823938921031",
  appId: "1:823938921031:web:05eee5cebea890f44af762"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Use getAuth diretamente para Node.js
const db = getFirestore(app);

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, db, addDoc, collection, doc, getDocs, signOut, setDoc, getDoc, updateDoc, query, where,onSnapshot,deleteDoc };