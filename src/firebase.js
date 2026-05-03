import { initializeApp } from 'firebase/app';
import { getPerformance } from "firebase/performance";

const firebaseConfig = {
  apiKey: "SIMULATED_KEY",
  authDomain: "vote-consciously.firebaseapp.com",
  projectId: "vote-consciously",
  storageBucket: "vote-consciously.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
export const perf = getPerformance(app);

console.log("Firebase Performance Monitoring initialized successfully (Stateless)");
