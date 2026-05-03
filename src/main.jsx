import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { perf } from './firebase.js'
import { trace } from 'firebase/performance'

// Firebase Performance Monitoring (Stateless metric tracking)
const t = trace(perf, 'initial_load');
t.start();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Ensure we meet the < 3 seconds on 3G metric constraint by monitoring load times
window.addEventListener('load', () => {
  t.stop();
  console.log("Performance trace stopped. Tracking 'under 3 seconds' metric.");
});
