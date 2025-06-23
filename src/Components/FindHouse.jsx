import React, { useEffect } from 'react';

const FindHouse = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const pageStyle = {
    background: 'linear-gradient(135deg, #0f172a, #1e293b)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '2rem',
    fontFamily: 'Montserrat, sans-serif',
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '3rem',
    textAlign: 'center',
    maxWidth: '500px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.37)',
    transition: 'transform 0.3s ease',
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  };

  const greenSpanStyle = {
    color: '#00c763', // emerald green
    fontSize: '1.75rem',
    fontWeight: '600',
  };

  const subtitleStyle = {
    fontSize: '1.1rem',
    color: '#e2e8f0',
    marginBottom: '2rem',
    lineHeight: '1.6',
  };

  const buttonStyle = {
    backgroundColor: '#00c763',
    color: 'white',
    padding: '0.9rem 2rem',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    display: 'inline-block',
  };

  const footerStyle = {
    fontSize: '0.75rem',
    color: '#9ca3af',
    marginTop: '1.5rem',
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Find a House</h1>
        <h1 style={greenSpanStyle}>Move With Swyft</h1>
        <p style={subtitleStyle}>
          Browse verified houses, avoid upfront agent cuts, and book movers —
          all in one place.
        </p>
        <a
          href="https://swyft-housing.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          style={buttonStyle}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.backgroundColor = '#00b85c';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.backgroundColor = '#00c763';
          }}
        >
          Go to Swyft Housing →
        </a>
        <p style={footerStyle}>Powered by Swyft</p>
      </div>
    </div>
  );
};

export default FindHouse;
