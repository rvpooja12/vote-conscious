const Hero = ({ onCheckStatus }) => {
  return (
    <section className="nike-container" style={{ textAlign: 'center', paddingTop: '8rem', paddingBottom: '6rem' }}>
      <h1 style={{ fontSize: 'clamp(3rem, 10vw, 8rem)', marginBottom: '1rem', lineHeight: 0.9 }}>
        VOTE <br /> CONSCIOUS.
      </h1>
      <p style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#666', marginBottom: '4rem' }}>
        a passion project by R V Pooja
      </p>
    </section>
  );
};

export default Hero;
