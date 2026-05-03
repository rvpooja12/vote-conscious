import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Rocket } from 'lucide-react';
import DynamicGuide from './DynamicGuide';
import TaskDrill from './TaskDrill';

const RegistrationHub = () => {
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="nike-container" style={{ paddingTop: '4rem' }}>
      <button 
        onClick={() => navigate('/')}
        className="btn-back"
        style={{ marginBottom: '4rem' }}
      >
        <ArrowLeft size={20} />
        BACK TO DASHBOARD
      </button>

      <h1 style={{ fontSize: '3.5rem', lineHeight: 1, marginBottom: '0.5rem', fontWeight: 900, fontStyle: 'italic' }}>
        GET ON THE LIST.
      </h1>
      <p style={{ color: 'var(--color-purple)', fontWeight: 900, fontStyle: 'italic', marginBottom: '3rem' }}>
        REGISTRATION HUB // 2026 ECI CYCLE
      </p>

      <div className="reg-hub-grid">
        <DynamicGuide />
        <TaskDrill onComplete={() => setIsComplete(true)} />
      </div>

      {isComplete && (
        <div 
          style={{ 
            marginTop: '6rem', 
            textAlign: 'center',
            background: '#111',
            padding: '6rem 2rem',
            border: '2px solid var(--color-purple)'
          }}
        >
          <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', fontWeight: 900, fontStyle: 'italic' }}>LEVEL UNLOCKED.</h2>
          <p style={{ fontSize: '1.25rem', marginBottom: '3rem', fontWeight: 700, opacity: 0.7 }}>
            YOU ARE NOW READY TO TRACK THE POWER MAP.
          </p>
          <button 
            className="btn-primary" 
            onClick={() => navigate('/')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Rocket size={24} />
              <span>NEXT LEVEL ACCESS</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default RegistrationHub;
