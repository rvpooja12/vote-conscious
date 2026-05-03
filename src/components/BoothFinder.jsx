import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, MapPin, ClipboardList, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { fetchBoothData, fetchBoothGuide, EPIC_FORMAT } from '../services/boothService';

const BoothFinder = () => {
  const [epicId, setEpicId] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [guide, setGuide] = useState(null);
  const [error, setError] = useState(null);
  const [isValidFormat, setIsValidFormat] = useState(false);
  const controls = useAnimation();
  const navigate = useNavigate();

  // Real-time validation
  useEffect(() => {
    setIsValidFormat(EPIC_FORMAT.test(epicId.toUpperCase()));
  }, [epicId]);

  const handleLocate = async (e) => {
    e.preventDefault();
    const formattedId = epicId.toUpperCase().trim();

    if (!EPIC_FORMAT.test(formattedId)) {
      triggerError("WRONG FORMAT. RETRY.");
      return;
    }

    setError(null);
    setResult(null);
    setGuide(null);
    setIsScanning(true);

    try {
      const data = await fetchBoothData(formattedId);
      setResult(data);
      const aiGuide = await fetchBoothGuide(data);
      setGuide(aiGuide);
    } catch (err) {
      if (err.status === 400) {
        triggerError("WRONG FORMAT. RETRY.");
        setEpicId('');
      } else {
        setError(err.message);
      }
    } finally {
      setIsScanning(false);
    }
  };

  const triggerError = async (msg) => {
    setError(msg);
    await controls.start({
      x: [-10, 10, -10, 10, 0],
      transition: { duration: 0.4 }
    });
  };

  const resetSearch = () => {
    setEpicId('');
    setResult(null);
    setGuide(null);
    setError(null);
  };

  return (
    <div className="nike-container" style={{ paddingTop: '4rem', minHeight: '100vh', paddingBottom: '4rem' }}>
      <button 
        onClick={() => navigate('/')}
        className="btn-back"
        style={{ marginBottom: '3rem' }}
      >
        <ArrowLeft size={20} /> BACK TO DASHBOARD
      </button>

      <header style={{ marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 900, fontStyle: 'italic', lineHeight: 1 }}>
          BOOTH <br /> FINDER.
        </h1>
        <p style={{ color: '#8B5CF6', fontWeight: 900, marginTop: '1rem', fontStyle: 'italic' }}>
          VERIFY YOUR COMBAT STATION // 2026 CYCLE
        </p>
      </header>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="search-view"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <form onSubmit={handleLocate} style={{ maxWidth: '600px' }}>
              <motion.div 
                animate={controls}
                style={{ position: 'relative', width: '100%' }}
              >
                <input 
                  type="text" 
                  value={epicId}
                  onChange={(e) => setEpicId(e.target.value.toUpperCase())}
                  placeholder="ENTER EPIC ID (e.g., ABC1234567)"
                  className="massive-input"
                  disabled={isScanning}
                  style={{ 
                    width: '100%',
                    padding: '2rem',
                    fontSize: '2rem',
                    fontWeight: 900,
                    background: '#0a0a0a',
                    border: `2px solid ${error ? '#ff0000' : (isValidFormat ? '#8B5CF6' : '#333')}`,
                    color: 'white',
                    fontStyle: 'italic',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                />
              </motion.div>

              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <p style={{ fontSize: '0.75rem', color: '#666', fontWeight: 700, letterSpacing: '0.05em' }}>
                  FORMAT: 3 LETTERS + 7 DIGITS. ENSURE YOUR ID MATCHES YOUR VOTER CARD.
                </p>
                
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      role="alert"
                      aria-live="assertive"
                      style={{ color: '#ff0000', fontWeight: 900, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      <AlertCircle size={16} />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button 
                type="submit" 
                disabled={isScanning || (!isValidFormat && epicId.length > 0)}
                className="btn-primary"
                style={{ 
                  width: '100%', 
                  marginTop: '2rem', 
                  padding: '1.5rem', 
                  fontSize: '1.2rem', 
                  fontWeight: 900,
                  background: isScanning ? '#222' : (isValidFormat ? '#8B5CF6' : '#222'),
                  cursor: isValidFormat ? 'pointer' : 'not-allowed',
                  opacity: isScanning ? 0.7 : 1
                }}
              >
                {isScanning ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                    <Loader2 className="animate-spin" />
                    <span>SCANNING ELECTORAL ROLL...</span>
                  </div>
                ) : (
                  isValidFormat ? "LOCATE BOOTH" : (epicId.length === 0 ? "ENTER ID" : "INVALID FORMAT")
                )}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            key="results-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ maxWidth: '800px' }}
          >
            <div className="booth-ticket" style={{ background: '#111', border: '1px solid #333', padding: '3rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#666', fontWeight: 900 }}>VOTER NAME</div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, fontStyle: 'italic' }}>{result.name}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#666', fontWeight: 900 }}>EPIC ID</div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, fontStyle: 'italic', color: '#8B5CF6' }}>{result.epic}</div>
                </div>
              </div>

              <div style={{ borderTop: '1px dashed #333', margin: '2rem 0' }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#666', fontWeight: 900 }}>CONSTITUENCY</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{result.constituency}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#666', fontWeight: 900 }}>BOOTH STATION</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{result.booth}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '3rem', opacity: 0.6 }}>
                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 900 }}>PART NO:</span>
                  <span style={{ marginLeft: '0.5rem', fontWeight: 900, color: '#8B5CF6' }}>{result.part_no}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 900 }}>SERIAL NO:</span>
                  <span style={{ marginLeft: '0.5rem', fontWeight: 900, color: '#8B5CF6' }}>{result.serial_no}</span>
                </div>
              </div>

              {guide && (
                <div style={{ marginTop: '3rem', background: '#050505', padding: '2rem', border: '1px solid #222' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#8B5CF6', marginBottom: '1.5rem', fontWeight: 900 }}>
                    <ClipboardList size={20} />
                    <span>GAME DAY PLAN // STRATEGY</span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {guide.map((step, i) => (
                      <motion.li 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        style={{ marginBottom: '1rem', borderLeft: '2px solid #333', paddingLeft: '1.5rem', fontSize: '1rem', color: '#ccc' }}
                      >
                        {step}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Map Mockup Integration */}
              <div style={{ marginTop: '3rem', width: '100%', height: '300px', background: '#111', border: '1px solid #333' }}>
                <iframe
                  title="Polling Booth Location"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://www.google.com/maps/embed/v1/place?key=MOCK_API_KEY&q=${encodeURIComponent(result.booth + ', ' + result.constituency)}&zoom=15`}
                ></iframe>
              </div>
            </div>

            <motion.button
              whileHover={{ backgroundColor: 'white', color: 'black' }}
              onClick={resetSearch}
              aria-label="Start a new search for a different EPIC ID"
              style={{
                marginTop: '2rem',
                width: '100%',
                padding: '1.5rem',
                background: 'transparent',
                border: '2px solid white',
                color: 'white',
                fontWeight: 900,
                fontSize: '1rem',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem'
              }}
            >
              <RefreshCw size={20} />
              CHECK ANOTHER EPIC ID
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BoothFinder;
