import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, FileText, ShieldCheck, AlertCircle, Loader2, BookOpen, Quote } from 'lucide-react';
import { fetchManifestoAnalysis, MOCK_MANIFESTOS, ELECTION_NAME, DEFAULT_PLACEHOLDER } from '../services/manifestoService';

const ManifestoAnalyst = () => {
  const [query, setQuery] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!query.trim() || !selectedCandidate) return;

    setReport(null);
    setIsLoading(true);

    try {
      const data = await fetchManifestoAnalysis(query, selectedCandidate);
      setReport(data);
    } catch (err) {
      console.error("Analysis failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const currentPlaceholder = selectedCandidate 
    ? `SEARCH ${MOCK_MANIFESTOS[selectedCandidate].name.toUpperCase()}'S POLICY...`
    : DEFAULT_PLACEHOLDER;

  const canAnalyze = selectedCandidate && query.trim() && !isLoading;

  return (
    <div className="nike-container" style={{ paddingTop: '4rem', paddingBottom: '8rem', position: 'relative' }}>
      <button 
        onClick={() => navigate('/')}
        className="btn-back"
        style={{ marginBottom: '3rem' }}
      >
        <ArrowLeft size={20} /> BACK TO DASHBOARD
      </button>

      <header style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 900, fontStyle: 'italic', color: 'white', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
          {ELECTION_NAME}
        </h2>
        <h1 style={{ fontSize: '4rem', fontWeight: 900, fontStyle: 'italic', lineHeight: 1 }}>
          MANIFESTO <br /> ANALYST.
        </h1>
        <p style={{ color: '#8B5CF6', fontWeight: 900, marginTop: '1rem', fontStyle: 'italic' }}>
          OBJECTIVE POLICY EXTRACTION // MOCK RAG v1.0
        </p>
      </header>

      {/* Candidate Scouting Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {Object.entries(MOCK_MANIFESTOS).map(([id, data]) => (
          <motion.div
            key={id}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedCandidate(id)}
            style={{
              padding: '2rem',
              background: '#0a0a0a',
              border: `1px solid ${selectedCandidate === id ? '#8B5CF6' : '#333'}`,
              cursor: 'pointer',
              transition: 'border-color 0.2s ease',
              position: 'relative'
            }}
          >
            {selectedCandidate === id && (
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#8B5CF6' }}>
                <ShieldCheck size={20} />
              </div>
            )}
            <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#666', marginBottom: '0.5rem' }}>SCOUTING TARGET</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, fontStyle: 'italic', margin: 0 }}>{data.name}</h2>
            <div style={{ fontSize: '0.9rem', color: '#8B5CF6', fontWeight: 700, marginTop: '0.25rem' }}>{data.party}</div>
            <p style={{ fontSize: '0.8rem', opacity: 0.5, marginTop: '1rem' }}>FOCUS: {data.focus}</p>
          </motion.div>
        ))}
      </div>

      <form onSubmit={handleAnalyze} style={{ maxWidth: '800px' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={currentPlaceholder}
            style={{
              width: '100%',
              padding: '2rem',
              paddingLeft: '4rem',
              fontSize: '1.5rem',
              fontWeight: 900,
              background: '#000',
              border: `2px solid ${selectedCandidate ? '#333' : '#222'}`,
              color: 'white',
              fontStyle: 'italic',
              outline: 'none',
              opacity: selectedCandidate ? 1 : 0.6
            }}
          />
          <Search style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', color: '#666' }} size={24} />
        </div>
        <button 
          type="submit" 
          disabled={!canAnalyze}
          className="btn-primary" 
          style={{ 
            width: '100%', 
            marginTop: '1rem', 
            padding: '1.5rem', 
            fontSize: '1.1rem', 
            fontWeight: 900,
            background: canAnalyze ? '#8B5CF6' : '#222',
            cursor: canAnalyze ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease'
          }}
        >
          {isLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              <Loader2 className="animate-spin" />
              <span>EXTRACTING DATA...</span>
            </div>
          ) : (
            selectedCandidate ? "RUN POLICY EXTRACTION" : "SELECT A CANDIDATE"
          )}
        </button>
      </form>

      <div className="analysis-output" aria-live="polite" style={{ marginTop: '4rem' }}>
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: 'center', padding: '4rem 0' }}
            >
              <div className="loader-ring" style={{ margin: '0 auto 2rem' }} />
              <p style={{ fontWeight: 900, fontStyle: 'italic', letterSpacing: '0.1em' }}>SIMULATING RAG EXTRACTION // GEMINI 1.5 FLASH ACTIVE</p>
            </motion.div>
          )}

          {report && (
            <motion.div 
              key="report"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ background: 'white', color: 'black', padding: '4rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', borderBottom: '2px solid #eee', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8B5CF6', fontWeight: 900 }}>
                </div>
                <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#999' }}>STRICTLY OBJECTIVE ANALYSIS</div>
              </div>

              <div style={{ marginBottom: '4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <BookOpen size={24} />
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 900, fontStyle: 'italic', margin: 0 }}>ANALYSIS</h3>
                </div>
                {report.isLink ? (
                  <p style={{ fontSize: '1.2rem', lineHeight: 1.6, color: '#333' }}>
                    This specific policy is not detailed in the available summary. 
                    <a href="#" style={{ color: '#8B5CF6', marginLeft: '0.5rem', textDecoration: 'underline' }}>[REVIEW FULL MOCK MANIFESTO HERE]</a>
                  </p>
                ) : (
                  <p style={{ fontSize: '1.2rem', lineHeight: 1.6, color: '#333' }}>{report.answer}</p>
                )}
              </div>

              {report.quotes && report.quotes.length > 0 && (
                <div style={{ marginBottom: '3rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <Quote size={24} />
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 900, fontStyle: 'italic', margin: 0 }}>DIRECT QUOTES</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {report.quotes.map((quote, i) => (
                      <div key={i} style={{ paddingLeft: '1.5rem', borderLeft: '4px solid #8B5CF6', fontStyle: 'italic', color: '#555', fontSize: '1.1rem' }}>
                        {quote}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {report.citations && report.citations.length > 0 && (
                <div style={{ borderTop: '1px solid #eee', paddingTop: '2rem', display: 'flex', gap: '2rem' }}>
                  {report.citations.map((cite, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8B5CF6', fontSize: '0.8rem', fontWeight: 900 }}>
                      <FileText size={14} />
                      <span>{cite.toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Global Disclaimer */}
      <div style={{ 
        marginTop: '6rem', 
        background: '#000', 
        border: '2px solid white', 
        padding: '2rem', 
        textAlign: 'center' 
      }}>
        <h4 style={{ color: 'white', fontWeight: 900, margin: '0 0 1rem 0', fontSize: '1.2rem' }}>ATTENTION: THIS IS A PROTOTYPE SIMULATION.</h4>
        <p style={{ color: 'white', opacity: 0.8, fontSize: '0.8rem', lineHeight: 1.6, margin: 0 }}>
          ALL CANDIDATE NAMES, PARTIES, AND POLICIES ARE FICTIONAL (MOCK) FOR DEMONSTRATION PURPOSES.<br/>
          NO REAL-WORLD POLITICAL DATA IS ACCESSED OR REPRESENTED HERE.
        </p>
      </div>
    </div>
  );
};

export default ManifestoAnalyst;
