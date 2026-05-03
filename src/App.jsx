import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import FeatureGrid from './components/FeatureGrid';
import EPICModal from './components/EPICModal';
import RegistrationHub from './components/RegistrationHub';
import ElectionPulse from './components/ElectionPulse';
import PowerMapper from './components/PowerMapper';
import BoothFinder from './components/BoothFinder';
import ManifestoAnalyst from './components/ManifestoAnalyst';
import IndelibleBadge from './components/IndelibleBadge';
import './firebase'; // Ensure firebase is initialized

function Dashboard({ onCheckStatus }) {
  return (
    <>
      <Hero onCheckStatus={onCheckStatus} />
      <FeatureGrid />
    </>
  );
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <BrowserRouter>
      <main style={{ minHeight: '100vh', paddingBottom: '8rem' }}>
        <Routes>
          <Route path="/" element={<Dashboard onCheckStatus={() => setIsModalOpen(true)} />} />
          <Route path="/register" element={<RegistrationHub />} />
          <Route path="/pulse" element={<ElectionPulse />} />
          <Route path="/power-mapper" element={<PowerMapper />} />
          <Route path="/booth-finder" element={<BoothFinder />} />
          <Route path="/manifesto" element={<ManifestoAnalyst />} />
          <Route path="/badge" element={<IndelibleBadge />} />
        </Routes>
        
        <EPICModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
        
        <footer className="nike-container" style={{ textAlign: 'center', opacity: 0.3, marginTop: '4rem' }}>
          <p>© 2026 VOTE CONSCIOUS. LEAD THE CHANGE.</p>
        </footer>
      </main>
    </BrowserRouter>
  );
}

export default App;
