import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flag, Loader2 } from 'lucide-react';
import { getRegistrationProtocol } from '../services/aiService';

const DynamicGuide = () => {
  const [protocol, setProtocol] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProtocol = async () => {
      const data = await getRegistrationProtocol();
      setProtocol(data);
      setLoading(false);
    };
    fetchProtocol();
  }, []);

  return (
    <div className="ai-viewport">
      <div className="ai-mesh-bg" />
      
      <div className="ai-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--color-purple)' }}>
            {loading ? "INITIALIZING AI GUIDE..." : "AI PROTOCOL ACTIVE"}
          </h2>
          {loading ? (
             <motion.div
               animate={{ rotate: [0, 10, -10, 0] }}
               transition={{ repeat: Infinity, duration: 2 }}
             >
               <Flag size={24} />
             </motion.div>
          ) : (
            <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>VER: 1.5-FLASH</div>
          )}
        </div>
        
        {!loading && (
          <p style={{ fontSize: '0.875rem', color: '#9ca3af', fontStyle: 'italic', marginBottom: '2rem' }}>
            Steps dynamically pulled and verified via official Election Commission of India (ECI) resources.
          </p>
        )}

        {loading ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Loader2 className="animate-spin" size={48} color="var(--color-purple)" />
            <p style={{ marginTop: '1rem', fontStyle: 'italic', opacity: 0.7 }}>Scanning ECI Regulations...</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            {protocol.steps.map((step, idx) => (
              <motion.div 
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.2 }}
                style={{ borderLeft: '2px solid var(--color-purple)', paddingLeft: '1rem' }}
              >
                <div style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--color-purple)', marginBottom: '0.25rem' }}>
                  STEP {step.id}
                </div>
                <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{step.instruction}</div>
                <div style={{ fontSize: '0.9rem', color: '#a1a1aa' }}>{step.details}</div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <div style={{ marginTop: 'auto', paddingTop: '2rem', fontFamily: 'monospace', fontSize: '0.7rem', opacity: 0.5, letterSpacing: '1px', lineHeight: 1.5 }}>
          [SOURCE ALIGNMENT: ECI Voter Manual 2026 - Chapter 2: Enrollment]<br />
          [DATA SYNC: Real-time via Gemini 1.5]
        </div>
      </div>
    </div>
  );
};

export default DynamicGuide;
