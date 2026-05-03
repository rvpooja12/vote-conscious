import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "SIMULATED_KEY",
  authDomain: "vote-consciously.firebaseapp.com",
  projectId: "vote-consciously",
  storageBucket: "vote-consciously.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

console.log("Firebase, Firestore & Auth initialized successfully (Simulated)");
