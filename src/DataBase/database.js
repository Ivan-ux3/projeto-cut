import { initializeApp } from "firebase/app";
import { 
  getFirestore, setDoc, getDocs, collection, getDoc, doc, query, where, 
  updateDoc, addDoc, arrayUnion, arrayRemove 
} from "firebase/firestore";
import { 
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
  onAuthStateChanged, signOut 
} from "firebase/auth";
import { getStorage } from "firebase/storage"; 

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCRcsGIev_ihRa1TujnlZ5UVR6kp1KW4So",
  authDomain: "cut-f3ffb.firebaseapp.com",
  projectId: "cut-f3ffb",
  storageBucket: "cut-f3ffb.firebasestorage.app",
  messagingSenderId: "1077993833990",
  appId: "1:1077993833990:web:d0ed3ae5a9b70192176587",
  measurementId: "G-84GT03P6BS"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app); 

export { 
  auth, 
  db, 
  storage,
  setDoc, 
  getDocs, 
  collection,
  getDoc,
  doc,
  query,
  where,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateDoc,
  addDoc,
  arrayRemove,
  arrayUnion
};