import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  RefreshCw, 
  XCircle, 
  Info, 
  ChevronRight 
} from 'lucide-react';
// Firebase removed for Zero-PII
import { RACE_DAY_SCHEDULE, getISTDate, fetchRaceRole, syncWithECI } from '../services/pulseService';

const ElectionPulse = () => {
  // Persistence: Restore expanded state from localStorage
  const [expandedNode, setExpandedNode] = useState(() => localStorage.getItem('pulse_expanded_node') || null);
  const [roleInfo, setRoleInfo] = useState({});
  const [loadingRole, setLoadingRole] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [dismissedPhases, setDismissedPhases] = useState({});
  const navigate = useNavigate();
  const userId = localStorage.getItem('voter_uid') || 'anonymous';
  const currentDate = getISTDate();

  // Cache expansion state locally
  useEffect(() => {
    if (expandedNode) {
      localStorage.setItem('pulse_expanded_node', expandedNode);
    } else {
      localStorage.removeItem('pulse_expanded_node');
    }
  }, [expandedNode]);

  useEffect(() => {
    const fetchUserData = () => {
      try {
        const stored = localStorage.getItem(`pulse_state_${userId}`);
        if (stored) {
          setDismissedPhases(JSON.parse(stored).dismissed || {});
        }
      } catch (err) {
        console.error("Local storage fetch error:", err);
      }
    };
    fetchUserData();
  }, [userId]);

  const handleNodeClick = async (nodeId) => {
    if (expandedNode === nodeId) {
      setExpandedNode(null);
      return;
    }
    
    setExpandedNode(nodeId);
    if (!roleInfo[nodeId]) {
      setLoadingRole(nodeId);
      const role = await fetchRaceRole(nodeId);
      setRoleInfo(prev => ({ ...prev, [nodeId]: role }));
      setLoadingRole(null);
    }
  };

  const dismissPhase = (e, nodeId) => {
    e.stopPropagation();
    const newDismissed = { ...dismissedPhases, [nodeId]: true };
    setDismissedPhases(newDismissed);
    try {
      localStorage.setItem(`pulse_state_${userId}`, JSON.stringify({ dismissed: newDismissed }));
    } catch (err) {
      console.error("Local storage sync error:", err);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    // Wired to simulated Cloud Run endpoint logic
    await syncWithECI();
    setSyncing(false);
  };

  const stripWordCount = (text) => {
    if (!text) return "";
    return text.replace(/\(\d+\s+words\)$/i, '').trim();
  };

  return (
    <div className="nike-container" style={{ paddingBottom: '4rem' }}>
      <div className="pulse-sync-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
        <button 
          onClick={() => navigate('/')}
          className="btn-back"
        >
          <ArrowLeft size={20} /> BACK TO DASHBOARD
        </button>
        <button 
          onClick={handleSync} 
          disabled={syncing} 
          className="btn-primary" 
          style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem', fontWeight: 900 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <RefreshCw size={18} className={syncing ? "animate-spin" : ""} />
            <span>SYNC ECI STATUS</span>
          </div>
        </button>
      </div>

      <header style={{ marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3.5rem', fontStyle: 'italic', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          INDIRA PRADESH ASSEMBLY ELECTIONS 2026
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <motion.div 
            animate={{ opacity: [1, 0, 1] }} 
            transition={{ repeat: Infinity, duration: 1.5 }}
            style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff0000', boxShadow: '0 0 10px #ff0000' }} 
          />
          <h2 style={{ fontSize: '1.2rem', color: '#8B5CF6', fontWeight: 900, letterSpacing: '0.05em' }}>
            COUNTING DAY: MAY 4, 2026 // RESULTS PENDING
          </h2>
        </div>
      </header>

      <ul className="pulse-container" role="list" style={{ position: 'relative' }}>
        <div className="timeline-track" />
        
        {RACE_DAY_SCHEDULE.map((node, index) => {
          if (dismissedPhases[node.id]) return null;

          const isCompleted = new Date(node.date) < currentDate;
          const isActive = new Date(node.date).toDateString() === currentDate.toDateString();
          const isUpcoming = new Date(node.date) > currentDate;
          const isExpanded = expandedNode === node.id;
          
          return (
            <motion.li 
              key={node.id} 
              className="timeline-node"
              role="listitem"
              aria-current={isActive ? "step" : undefined}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`node-marker-race ${isCompleted ? 'completed' : ''} ${isActive ? 'active-glow' : ''} ${isUpcoming ? 'upcoming-dotted' : ''}`}>
                {isCompleted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
              </div>

              <motion.div 
                className={`node-content-race ${isActive ? 'active-border' : ''}`}
                onClick={() => handleNodeClick(node.id)}
                role="button"
                aria-expanded={isExpanded}
                tabIndex={0}
                whileHover={{ 
                  scale: 1.01, 
                  backgroundColor: '#222',
                  borderColor: '#8B5CF6',
                  borderWidth: '2px'
                }}
                style={{ 
                  transition: 'all 0.2s ease',
                  borderLeft: isExpanded ? '4px solid #8B5CF6' : '1px solid #333',
                  background: isExpanded ? '#111' : '#0a0a0a',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div className="label-condensed" style={{ color: isCompleted ? '#8B5CF6' : 'white', fontSize: '0.7rem' }}>
                      {isCompleted ? 'COMPLETED' : isActive ? 'ACTIVE' : 'PENDING'}
                    </div>
                    <h3 style={{ fontSize: '1.6rem', fontStyle: 'italic', fontWeight: 900, margin: '0.25rem 0' }}>{node.label}</h3>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {isCompleted && (
                      <button 
                        className="dismiss-btn"
                        onClick={(e) => dismissPhase(e, node.id)}
                        aria-label={`Dismiss ${node.label}`}
                        style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer' }}
                      >
                        <XCircle size={18} />
                      </button>
                    )}
                    <motion.div
                      animate={{ x: isExpanded ? 5 : 0 }}
                      style={{ color: '#8B5CF6', opacity: isExpanded ? 1 : 0.3 }}
                    >
                      <ChevronRight size={24} style={{ filter: isExpanded ? 'drop-shadow(0 0 5px #8B5CF6)' : 'none' }} />
                    </motion.div>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="vibe-engine-box" style={{ marginTop: '1.5rem', background: '#050505', padding: '1.5rem', border: '1px solid #222' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#8B5CF6', fontWeight: 900, fontSize: '0.8rem' }}>
                          <Info size={16} />
                          <span>VOTER ROLE // VIGILANCE</span>
                        </div>
                        {loadingRole === node.id ? (
                          <div className="loading-dots" style={{ fontSize: '0.9rem', opacity: 0.5 }}>CONSULTING AI...</div>
                        ) : (
                          <p style={{ fontSize: '1rem', lineHeight: 1.5, color: '#eee', fontWeight: 500 }}>
                            {stripWordCount(roleInfo[node.id])}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.li>
          );
        })}
      </ul>

      <footer style={{ marginTop: '6rem', borderTop: '1px solid #222', paddingTop: '2rem', textAlign: 'center' }}>
        <p style={{ 
          fontFamily: 'monospace', 
          fontSize: '0.7rem', 
          textTransform: 'uppercase', 
          letterSpacing: '0.15em', 
          color: '#444',
          lineHeight: 1.8
        }}>
          SOURCE: ECI SCHEDULE ANNOUNCEMENT (MARCH 15, 2026) // VERIFIED VIA PIB DELHI.<br/>
          STANCE: STRICTLY OBJECTIVE & NON-PARTISAN.
        </p>
      </footer>
    </div>
  );
};

export default ElectionPulse;
