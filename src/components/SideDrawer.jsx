import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, ShieldCheck, Loader2 } from 'lucide-react';
import { fetchRoleInfo } from '../services/powerService';

// Local cache for AI responses
const aiCache = {};

const SideDrawer = ({ isOpen, onClose, role }) => {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && role) {
      if (aiCache[role.id]) {
        setInfo(aiCache[role.id]);
      } else {
        const getInfo = async () => {
          setLoading(true);
          const data = await fetchRoleInfo(role.id);
          aiCache[role.id] = data;
          setInfo(data);
          setLoading(false);
        };
        getInfo();
      }
    }
  }, [isOpen, role]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            className="sheet-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div 
            className="sheet-content"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <button 
              onClick={onClose}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
              aria-label="Close Drawer"
            >
              <X size={32} />
            </button>

            <div>
              <div className="sheet-meta">{role?.level}</div>
              <h2 className="sheet-title">{role?.label}</h2>
            </div>

            <div className="sheet-playbook">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-purple)', marginBottom: '1rem', fontWeight: 900 }}>
                <BookOpen size={20} />
                <span>PLAYBOOK SUMMARY</span>
              </div>
              
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '2rem 0' }}>
                  <Loader2 className="animate-spin" size={24} />
                  <span>Consulting Constitutional Archives...</span>
                </div>
              ) : (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ lineHeight: 1.6, color: '#ccc' }}
                >
                  {info}
                </motion.p>
              )}
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '1rem', opacity: 0.5 }}>
              <ShieldCheck size={20} />
              <span style={{ fontSize: '0.8rem' }}>SOURCE: CONSTITUTION OF INDIA</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SideDrawer;
