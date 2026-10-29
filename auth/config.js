import { initializeApp } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js';

import { getAuth } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js';

import { getFirestore } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js';

    const firebaseConfig = {
  apiKey: "AIzaSyAPMtaFLU7ITYpM0ZKcx3kn3UeJFYSHylY",
  authDomain: "fooddash-21946.firebaseapp.com",
  projectId: "fooddash-21946",
  storageBucket: "fooddash-21946.firebasestorage.app",
  messagingSenderId: "331303435882",
  appId: "1:331303435882:web:08b191801e531edf7c1413",
  measurementId: "G-JD4GH195RJ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);