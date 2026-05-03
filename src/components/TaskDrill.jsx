import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, ExternalLink, Info, LogOut } from 'lucide-react';
// Removed Firebase imports to maintain Zero-PII architecture
import confetti from 'canvas-confetti';

const TASKS = [
  { id: 'profile_ready', label: 'Profile Information Ready', aria: 'Verify personal profile information is ready' },
  { id: 'docs_verified', label: 'Documents Verified (Aadhaar/Proof)', aria: 'Confirm Aadhaar and address proof are verified' },
  { id: 'booth_located', label: 'Booth Located via Finder', aria: 'Verify polling booth location has been identified' },
  { id: 'form_submitted', label: 'Form 6 Submission Complete', aria: 'Confirm Form 6 has been submitted to ECI' }
];

const TaskDrill = ({ onComplete }) => {
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  const handleLogout = async () => {
    sessionStorage.removeItem('mock_user');
    setUser(null);
    setProgress({});
  };
  
  useEffect(() => {
    const mockSession = sessionStorage.getItem('mock_user');
    if (mockSession) {
      const mockUser = JSON.parse(mockSession);
      setUser(mockUser);
      fetchProgress(mockUser.uid);
    } else {
      setUser(null);
      setLoading(false);
    }
  }, []);

  const fetchProgress = async (uid) => {
    try {
      const stored = localStorage.getItem(`progress_${uid}`);
      if (stored) {
        setProgress(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Error fetching progress:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    // MOCK LOGIN for Prototype/Demo (Zero-PII)
    const mockUser = {
      uid: 'mock_user_123',
      displayName: 'Conscious Voter',
      email: 'voter@example.com'
    };
    
    setUser(mockUser);
    fetchProgress(mockUser.uid);
    
    // Store in session to persist across reloads in mock mode
    sessionStorage.setItem('mock_user', JSON.stringify(mockUser));
  };

  const toggleTask = async (taskId) => {
    if (!user) return; // Gate task toggling

    const newProgress = { ...progress, [taskId]: !progress[taskId] };
    setProgress(newProgress);
    
    // Sync to localStorage
    try {
      localStorage.setItem(`progress_${user.uid}`, JSON.stringify(newProgress));
    } catch (err) {
      console.error("Error saving progress:", err);
    }

    // Check if all tasks are complete
    const completedCount = TASKS.filter(t => newProgress[t.id]).length;
    if (completedCount === TASKS.length) {
      triggerCelebration();
      onComplete();
    }
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8B5CF6', '#ffffff', '#7c3aed']
    });
  };

  return (
    <div className="checklist-container">
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontStyle: 'italic' }}>THE DRILL</h2>
      
      {/* Authentication Gate */}
      <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #222' }}>
        <AnimatePresence mode="wait">
          {!user ? (
            <motion.div 
              key="login"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Info size={16} color="white" />
                <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>To track and save your progress across sessions, authenticate below.</span>
              </div>
              <button 
                onClick={handleLogin}
                className="btn-login-google"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  backgroundColor: 'white',
                  color: 'black',
                  border: 'none',
                  padding: '1rem 1.5rem',
                  fontWeight: 900,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'all 0.3s ease'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                  <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                  <path fill="#FBBC05" d="M3.964 10.711c-.18-.54-.282-1.117-.282-1.711s.102-1.171.282-1.711V4.957H.957C.347 6.173 0 7.548 0 9s.347 2.827.957 4.043l3.007-2.332z"/>
                  <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.582C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.957l3.007 2.332c.708-2.127 2.692-3.711 5.036-3.711z"/>
                </svg>
                <span>SIGN IN WITH GOOGLE</span>
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="verified"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div style={{ color: 'var(--color-purple)', fontWeight: 900, fontSize: '0.8rem', letterSpacing: '1px' }}>
                USER VERIFIED. PROGRESS SYNC ACTIVE.
              </div>
              <button 
                onClick={handleLogout}
                className="btn-back"
                style={{ 
                  padding: '0.5rem 1rem', 
                  fontSize: '0.7rem', 
                  borderColor: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <LogOut size={14} />
                SIGN OUT
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div style={{ opacity: user ? 1 : 0.4, pointerEvents: user ? 'auto' : 'none', transition: 'opacity 0.3s ease' }}>
        {TASKS.map((task) => (
          <div 
            key={task.id}
            className={`checklist-item ${progress[task.id] ? 'checked' : ''}`}
            onClick={() => toggleTask(task.id)}
            role="checkbox"
            aria-checked={progress[task.id]}
            aria-label={task.aria}
            tabIndex={user ? 0 : -1}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleTask(task.id); }}
            style={{ cursor: user ? 'pointer' : 'not-allowed' }}
          >
            <div className="checkbox-custom">
              {progress[task.id] && <Check size={18} color="white" />}
            </div>
            <span style={{ fontWeight: 700, textTransform: 'uppercase' }}>{task.label}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ fontSize: '1rem', opacity: 0.5, marginBottom: '1rem' }}>OFFICIAL ECI RESOURCES</h3>
        <a 
          href="https://voters.eci.gov.in" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="eci-link-btn"
          aria-label="Visit ECI Voters Portal"
        >
          <span>ECI VOTERS PORTAL</span>
          <ChevronRight size={20} />
        </a>
        <a 
          href="https://eci.gov.in" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="eci-link-btn"
          aria-label="Visit Main ECI Website"
        >
          <span>OFFICIAL ECI MAIN SITE</span>
          <ExternalLink size={20} />
        </a>
      </div>
    </div>
  );
};

export default TaskDrill;
