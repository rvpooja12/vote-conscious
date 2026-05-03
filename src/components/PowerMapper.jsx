import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  LandPlot, 
  Map, 
  Building2, 
  Fingerprint, 
  Users, 
  Gavel 
} from 'lucide-react';

const ARENAS = [
  { 
    id: 'lok_sabha', 
    title: 'LOK SABHA', 
    subtitle: '(NATIONAL)', 
    desc: 'The National Lifecycle. Map the flow of power from your booth to the Parliament.',
    icon: LandPlot,
    status: 'LIVE RESULTS',
    statusType: 'live'
  },
  { 
    id: 'vidhan_sabha', 
    title: 'VIDHAN SABHA', 
    subtitle: '(STATE)', 
    desc: 'The Regional Power Flow. Trace how your vote defines the leadership of your state.',
    icon: Map,
    status: 'LIVE RESULTS',
    statusType: 'live'
  },
  { 
    id: 'local_body', 
    title: 'LOCAL BODY', 
    subtitle: '(MUNICIPAL)', 
    desc: 'Tracing how your vote defines the leadership of your city or village.',
    icon: Building2,
    status: 'UPCOMING: 2027',
    statusType: 'upcoming'
  }
];

const POWER_DATA = {
  lok_sabha: {
    title: "LOK SABHA FLOW",
    nodes: [
      { id: 'vote', label: 'THE VOTE', icon: Fingerprint, subtext: 'The pulsing heart of democracy.', type: 'base', aria: 'Individual vote' },
      { id: 'mp', label: 'MEMBER OF PARLIAMENT (MP)', icon: Users, subtext: 'Representing your Constituency in the Lok Sabha.', type: 'mid', aria: 'Legislative representative' },
      { id: 'pm', label: 'PRIME MINISTER', icon: Gavel, subtext: 'Elected by the majority of MPs to lead the Executive.', type: 'apex', aria: 'Head of Union Government' }
    ]
  },
  vidhan_sabha: {
    title: "VIDHAN SABHA FLOW",
    nodes: [
      { id: 'vote', label: 'THE VOTE', icon: Fingerprint, subtext: 'The pulsing heart of democracy.', type: 'base', aria: 'Individual vote' },
      { id: 'mla', label: 'MEMBER OF LEGISLATIVE ASSEMBLY (MLA)', icon: Users, subtext: 'Representing your district in the State Vidhan Sabha.', type: 'mid', aria: 'State legislative representative' },
      { id: 'cm', label: 'CHIEF MINISTER', icon: Gavel, subtext: 'Appointed by the Governor based on MLA majority support.', type: 'apex', aria: 'Head of State Government' }
    ]
  },
  local_body: {
    title: "MUNICIPAL FLOW",
    nodes: [
      { id: 'vote', label: 'THE VOTE', icon: Fingerprint, subtext: 'The pulsing heart of democracy.', type: 'base', aria: 'Individual vote' },
      { id: 'corp', label: 'CORPORATOR', icon: Users, subtext: 'Your representative for local civic issues like water, roads, and waste.', type: 'mid', aria: 'Local representative' },
      { id: 'mayor', label: 'MAYOR', icon: Gavel, subtext: 'The ceremonial and executive head of the Municipal Corporation.', type: 'apex', aria: 'Municipal head' }
    ]
  }
};

const PowerMapper = () => {
  const [arena, setArena] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="nike-container" style={{ minHeight: 'auto', paddingBottom: '1rem', paddingTop: '1rem' }}>
      <AnimatePresence mode="wait">
        {!arena ? (
          <motion.div
            key="selection-hub"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <button 
              onClick={() => navigate('/')}
              className="btn-back"
              style={{ marginBottom: '2rem' }}
            >
              <ArrowLeft size={20} /> BACK TO DASHBOARD
            </button>

            <h1 style={{ fontSize: '3rem', fontWeight: 900, fontStyle: 'italic', marginBottom: '0.5rem' }}>
              SELECT YOUR <span style={{ color: '#8B5CF6' }}>ARENA</span>
            </h1>
            <p style={{ opacity: 0.5, fontWeight: 700, marginBottom: '2rem', letterSpacing: '0.1em', fontSize: '0.8rem' }}>
              CHOOSE YOUR ELECTORAL SCALE // STRATEGIC PLAYBOOK 2026
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {ARENAS.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)', borderColor: '#8B5CF6' }}
                    onClick={() => setArena(item.id)}
                    style={{ 
                      background: '#0a0a0a', 
                      border: '1px solid #333', 
                      padding: '2rem', 
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      position: 'relative',
                      transition: 'border-color 0.2s ease'
                    }}
                  >
                    {/* Status Badge */}
                    <div 
                      role="status"
                      style={{ 
                        position: 'absolute', 
                        top: '1.5rem', 
                        right: '1.5rem', 
                        fontSize: '0.65rem', 
                        fontWeight: 900,
                        padding: '0.25rem 0.5rem',
                        background: item.statusType === 'live' ? '#8B5CF6' : '#222',
                        color: item.statusType === 'live' ? 'white' : '#666',
                        letterSpacing: '1px'
                      }}
                    >
                      {item.statusType === 'live' ? (
                        <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                          {item.status}
                        </motion.span>
                      ) : (
                        <span>{item.status}</span>
                      )}
                    </div>

                    <div style={{ color: '#8B5CF6' }}>
                      <Icon size={40} title={item.title} />
                    </div>
                    <h2 style={{ fontSize: '2rem', margin: 0, fontStyle: 'italic', fontWeight: 900 }}>{item.title}</h2>
                    <p style={{ opacity: 0.7, margin: 0, fontWeight: 700 }}>{item.subtitle}</p>
                    <p style={{ opacity: 0.5, marginTop: '1rem', fontSize: '0.9rem', lineHeight: 1.6 }}>{item.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="flow-diagram"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <button 
              onClick={() => setArena(null)}
              className="btn-back"
              style={{ marginBottom: '1rem' }}
            >
              <ArrowLeft size={20} /> ← RETURN TO ARENA
            </button>

            <h1 style={{ fontSize: '2rem', fontWeight: 900, fontStyle: 'italic', marginBottom: '1rem' }}>
              {POWER_DATA[arena].title}
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', padding: '1rem 0' }}>
              
              {/* Animated Power Line with Gradient Drawing Effect */}
              <div style={{ position: 'absolute', bottom: '50px', width: '4px', height: 'calc(100% - 100px)', background: 'rgba(255,255,255,0.1)', zIndex: 0 }}>
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: '100%' }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  style={{ 
                    width: '100%', 
                    background: 'linear-gradient(to top, #ffffff, #8B5CF6)', 
                    boxShadow: '0 0 15px #8B5CF6'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '1.5rem', width: '100%', maxWidth: '400px', zIndex: 1 }}>
                {POWER_DATA[arena].nodes.map((node, index) => {
                  const NodeIcon = node.icon;
                  return (
                    <motion.div
                      key={node.id}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: index * 0.4 }}
                      style={{ 
                        background: '#000', 
                        border: `1px solid ${node.type === 'base' ? '#8B5CF6' : 'rgba(255,255,255,0.2)'}`, 
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        position: 'relative',
                        boxShadow: node.type === 'base' ? '0 0 30px rgba(139, 92, 246, 0.15)' : 'none'
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={node.aria}
                    >
                      <div style={{ color: node.type === 'apex' ? '#8B5CF6' : 'white', marginBottom: '0.5rem' }}>
                        <NodeIcon size={20} title={node.label} />
                      </div>
                      <h3 style={{ 
                        margin: 0, 
                        fontSize: '1rem', 
                        fontWeight: 900,
                        fontStyle: 'italic',
                        color: node.type === 'base' ? '#8B5CF6' : 'white' 
                      }}>
                        {node.label}
                      </h3>
                      <p style={{ 
                        margin: '0.25rem 0 0 0', 
                        opacity: 0.5, 
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        maxWidth: '95%'
                      }}>
                        {node.subtext}
                      </p>
                      
                      {node.type === 'base' && (
                        <motion.div 
                          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          style={{ 
                            position: 'absolute', 
                            bottom: '-5px', 
                            width: '10px', 
                            height: '10px', 
                            borderRadius: '50%', 
                            background: '#8B5CF6',
                            boxShadow: '0 0 10px #8B5CF6'
                          }}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PowerMapper;
