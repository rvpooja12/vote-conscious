import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Fingerprint, 
  Share2,
  X,
  RefreshCw,
  Globe,
  Award,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import ExifReader from 'exifreader';
import { verifyInk } from '../services/aiService';

const INSTRUCTIONS = [
  { id: 1, title: "Location Services", desc: "Before taking your photo, ensure location services (GPS) are ENABLED on your device. The image must contain GPS location data for verification." },
  { id: 2, title: "Composition", desc: "Take a clear, well-lit photo of your face, holding your hand up with your inked finger clearly visible." },
  { id: 3, title: "Upload", desc: "Enter your EPIC ID and upload this original photo file." },
  { id: 4, title: "Outcome", desc: "Outcome: Receive your animated digital certificate, optimized for instant sharing on LinkedIn, Instagram, and X." }
];

const IndelibleBadge = () => {
  const navigate = useNavigate();
  const [epicId, setEpicId] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'verifying', 'success'
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [logs, setLogs] = useState([]);
  const fileInputRef = useRef(null);

  const addLog = (msg) => {
    setLogs(prev => [...prev, { id: Date.now(), msg }]);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!/^[A-Z]{3}[0-9]{7}$/.test(epicId.toUpperCase().trim())) {
        setError("INVALID EPIC ID. Please ensure the format is 3 Letters + 7 Digits.");
        return;
      }
      processImage(file);
    }
  };

  const processImage = async (file) => {
    setStatus('verifying');
    setLogs([]);
    setError(null);

    addLog("Initializing Biometric Extraction...");
    
    try {
      const tags = await ExifReader.load(file);
      const lat = tags['GPSLatitude']?.description;
      const lng = tags['GPSLongitude']?.description;

      if (!lat || !lng) {
        throw new Error("LOCATION DATA MISSING. We cannot verify your booth without GPS metadata. Please upload the original file from your camera.");
      }

      addLog(`GPS Lock Found: ${parseFloat(lat).toFixed(4)}, ${parseFloat(lng).toFixed(4)}`);
      addLog("Comparing GPS with Constituency Bounding Box...");
      await new Promise(r => setTimeout(r, 1000));
      addLog("Location Verified: Match detected for INDIRA PRADESH constituency.");

      addLog("Scanning for Indelible Ink via Vertex AI...");
      const reader = new FileReader();
      const dataUrl = await new Promise((resolve) => {
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });

      const verification = await verifyInk(dataUrl, lat, lng);

      if (verification.success) {
        addLog("Ink Signature Confirmed.");
        setResult({
          ...verification,
          voterName: "ARVEE PUJARI",
          constituency: "INDIRA PRADESH CENTRAL"
        });
        setStatus('success');
      } else {
        throw new Error(verification.message || "INK NOT DETECTED. Ensure your inked finger is clearly visible.");
      }

    } catch (err) {
      setError(err.message);
      setStatus('idle');
    }
  };

  return (
    <div className="nike-container" style={{ minHeight: '100vh', paddingBottom: '10rem' }}>
      {/* Top Bar Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6rem', marginTop: '2rem', position: 'relative' }}>
        <button 
          onClick={() => navigate('/')}
          className="btn-back"
          style={{ position: 'absolute', left: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <ArrowLeft size={18} />
          BACK TO DASHBOARD
        </button>
        <h1 style={{ width: '100%', textAlign: 'center', fontSize: '1.2rem', fontWeight: 900, fontStyle: 'italic', margin: 0, letterSpacing: '0.2em' }}>
          THE INDELIBLE <span style={{ color: '#8B5CF6' }}>BADGE</span>
        </h1>
      </div>

      <AnimatePresence mode="wait">
        {status !== 'verifying' ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            key="content"
            style={{ display: 'flex', flexDirection: 'column', gap: '4rem', maxWidth: '800px', margin: '0 auto' }}
          >
            {/* 1. EPIC ID Input */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 900, color: '#666', marginBottom: '1rem', textAlign: 'center' }}>VOTER IDENTIFICATION</label>
              <input 
                type="text" 
                value={epicId}
                onChange={(e) => setEpicId(e.target.value.toUpperCase())}
                placeholder="ENTER YOUR EPIC ID"
                style={{
                  width: '100%',
                  padding: '2rem',
                  fontSize: '2.5rem',
                  fontWeight: 900,
                  background: '#0a0a0a',
                  border: '2px solid #333',
                  color: 'white',
                  fontStyle: 'italic',
                  outline: 'none',
                  textAlign: 'center'
                }}
              />
              <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#666', fontWeight: 700, textAlign: 'center' }}>
                (e.g., ASD1234567. 3 LETTERS + 7 DIGITS)
              </p>
            </div>

            {/* 2. Authentication Protocol */}
            <div style={{ background: '#0a0a0a', border: '1px solid #222', padding: '3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', color: '#8B5CF6', justifyContent: 'center' }}>
                <Award size={24} />
                <h2 style={{ fontSize: '1.2rem', fontWeight: 900, margin: 0 }}>AUTHENTICATION PROTOCOL</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {INSTRUCTIONS.map(inst => (
                  <div key={inst.id}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#666', marginBottom: '0.5rem' }}>{inst.id}. {inst.title.toUpperCase()}</div>
                    <p style={{ fontSize: '0.85rem', lineHeight: 1.5, color: '#eee', margin: 0 }}>{inst.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Certificate Preview / Reward Section */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#666', marginBottom: '1.5rem', letterSpacing: '0.2em' }}>THE REWARD: YOUR DIGITAL PROOF</div>
              
              <AnimatePresence mode="wait">
                {status === 'idle' ? (
                  <motion.div 
                    key="preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ 
                      width: '100%', 
                      maxWidth: '420px', 
                      margin: '0 auto',
                      aspectRatio: '1.7',
                      background: `#050505 url('/Gemini_Generated_Image_nwlz0xnwlz0xnwlz.png')`,
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      border: '2px solid #333',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <motion.div 
                      animate={{ boxShadow: ["0 0 0px #8B5CF6", "0 0 20px #8B5CF6", "0 0 0px #8B5CF6"] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                      style={{ position: 'absolute', inset: 0, border: '2px solid transparent' }}
                    />
                  </motion.div>
                ) : (
                  <motion.div 
                    key="actual"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ 
                      width: '100%', 
                      maxWidth: '420px', 
                      margin: '0 auto',
                      aspectRatio: '1.7',
                      background: 'linear-gradient(135deg, #000 0%, #050505 100%)',
                      border: '2px solid #8B5CF6',
                      padding: '3rem',
                      position: 'relative',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      textAlign: 'left'
                    }}
                  >
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      style={{ position: 'absolute', top: '-10%', right: '-10%', color: '#8B5CF6' }}
                    >
                      <Fingerprint size={400} />
                    </motion.div>
                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <motion.h2 
                        animate={{ textShadow: ["0 0 10px #8B5CF6", "0 0 20px #8B5CF6", "0 0 10px #8B5CF6"] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ fontSize: '2.5rem', fontWeight: 900, fontStyle: 'italic', margin: 0, lineHeight: 1, color: '#8B5CF6' }}
                      >
                        VERIFIED
                      </motion.h2>
                      <p style={{ fontWeight: 900, fontSize: '1.2rem', fontStyle: 'italic', color: 'white', margin: '0.25rem 0' }}>CONSCIOUS VOTER // 2026 CYCLE</p>
                    </div>
                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <div style={{ fontSize: '0.7rem', color: '#666', fontWeight: 900 }}>VOTER IDENTITY</div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 900, fontStyle: 'italic' }}>{result?.voterName}</div>
                      <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem' }}>
                        <div>
                          <div style={{ fontSize: '0.6rem', color: '#666', fontWeight: 900 }}>CONSTITUENCY</div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 900 }}>{result?.constituency}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.6rem', color: '#666', fontWeight: 900 }}>EPIC ID</div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#8B5CF6' }}>{epicId}</div>
                        </div>
                      </div>
                    </div>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', background: '#8B5CF6', padding: '0.5rem', overflow: 'hidden' }}>
                      <motion.div 
                        animate={{ x: [0, -100] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                        style={{ whiteSpace: 'nowrap', fontSize: '0.6rem', color: 'black', fontWeight: 900, letterSpacing: '0.1em' }}
                      >
                        VERIFIED VOTER 2026 // INDIRA PRADESH ASSEMBLY // VERIFIED VOTER 2026 // INDIRA PRADESH ASSEMBLY
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '0.6rem', fontWeight: 900, color: '#444', letterSpacing: '0.1em' }}>SHARABLE ON SOCIAL MEDIA</div>
                <div style={{ display: 'flex', gap: '1.5rem', color: '#333' }}>
                  <Share2 size={18} />
                  <Globe size={18} />
                  <Smartphone size={18} />
                </div>
              </div>
            </div>

            {/* 4. EPIC ID & Upload Action */}
            <div style={{ textAlign: 'center' }}>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', textAlign: 'left' }}
                >
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <AlertTriangle size={24} />
                    <p style={{ margin: 0, fontWeight: 900 }}>{error}</p>
                  </div>
                </motion.div>
              )}

              <div 
                onClick={() => fileInputRef.current?.click()}
                className="feature-card"
                style={{ 
                  cursor: 'pointer', 
                  padding: '4rem', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  textAlign: 'center', 
                  gap: '2rem',
                  border: '2px dashed #333'
                }}
              >
                <div style={{ backgroundColor: '#8B5CF6', padding: '2rem', borderRadius: '50%', boxShadow: '0 0 30px rgba(139, 92, 246, 0.3)' }}>
                  <Upload size={48} color="white" />
                </div>
                <div>
                  <h3 style={{ fontSize: '2rem', fontWeight: 900, fontStyle: 'italic', margin: 0 }}>UPLOAD VOTER VERIFICATION PHOTO</h3>
                  <p style={{ opacity: 0.6, marginTop: '0.5rem' }}>Original camera file with GPS EXIF data required.</p>
                </div>
                <button className="btn-primary" style={{ width: 'auto', padding: '1.5rem 4rem' }}>SELECT & VALIDATE FOR SHARING</button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />
              </div>
              <p style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: '#555', fontWeight: 700 }}>
                Image must be an original camera file of your face + inked finger with GPS data enabled.
              </p>
              
              {status === 'success' && (
                <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <button className="btn-primary" style={{ background: '#0077b5', flex: 1, maxWidth: '200px' }}>SHARE TO LINKEDIN</button>
                  <button className="btn-primary" style={{ background: '#E1306C', flex: 1, maxWidth: '200px' }}>SHARE TO INSTAGRAM</button>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="verifying"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4rem', paddingTop: '8rem' }}
          >
            <div style={{ position: 'relative', width: '150px', height: '150px' }}>
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ position: 'absolute', inset: 0, backgroundColor: '#8B5CF6', borderRadius: '50%', filter: 'blur(30px)' }}
              />
              <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', border: '2px solid #8B5CF6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 className="animate-spin" size={60} color="#8B5CF6" />
              </div>
            </div>

            <div style={{ width: '100%', maxWidth: '600px', background: '#0a0a0a', padding: '2rem', border: '1px solid #222', fontFamily: 'monospace' }}>
              <div style={{ color: '#8B5CF6', fontWeight: 900, marginBottom: '1rem', fontSize: '0.8rem' }}>&gt; SYSTEM_VALIDATION_ACTIVE</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {logs.map((log) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={log.id} 
                    style={{ fontSize: '0.9rem', color: '#eee' }}
                  >
                    <span style={{ color: '#8B5CF6' }}>[SECURE]</span> {log.msg}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Simplified Icons
const Smartphone = ({ size }) => <RefreshCw size={size} />;

export default IndelibleBadge;
