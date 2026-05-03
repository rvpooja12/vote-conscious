import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const EPICModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay" onClick={onClose}>
          <motion.div 
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            <button 
              onClick={onClose}
              style={{ 
                position: 'absolute', 
                top: '1rem', 
                right: '1rem', 
                background: 'none', 
                border: 'none', 
                color: 'white', 
                cursor: 'pointer' 
              }}
            >
              <X size={24} />
            </button>
            
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>VERIFY STATUS</h2>
            <p style={{ color: '#a1a1aa' }}>Enter your EPIC ID to locate your profile.</p>
            
            <input 
              type="text" 
              placeholder="e.g. ABC1234567" 
              autoFocus
            />
            
            <button 
              className="btn-primary" 
              style={{ width: '100%', padding: '1rem' }}
              onClick={() => {
                alert("Simulated: Searching for voter records...");
                onClose();
              }}
            >
              SEARCH RECORDS
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EPICModal;
