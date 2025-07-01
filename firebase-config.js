// Firebase SDK
import { initializeApp } from " https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js ";
import { getFirestore, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js ";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0ULuda8dWAtiBTvz0WyaHe3fcRO0WrWI",
  authDomain: "sevgili-takip-5fa16.firebaseapp.com",
  projectId: "sevgili-takip-5fa16",
  storageBucket: "sevgili-takip-5fa16.firebasestorage.app",
  messagingSenderId: "147634239096",
  appId: "1:147634239096:web:b16e15aed753981dd3df8d",
  measurementId: "G-WQJN3P9YSM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, onSnapshot };
