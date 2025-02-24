import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../Styles/findDriver.css';

const FindDriver = ({ onDriverFound, onDriverNotFound }) => {
  const navigate = useNavigate();
  const [noDriverFound, setNoDriverFound] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // Refs to store timers so they can be cleared if needed.
  const driverTimerRef = useRef(null);
  const noDriverTimerRef = useRef(null);

  const startSearch = useCallback(() => {
    // Clear any existing timers.
    if (driverTimerRef.current) clearTimeout(driverTimerRef.current);
    if (noDriverTimerRef.current) clearTimeout(noDriverTimerRef.current);

    // Reset states.
    setNoDriverFound(false);
    setShowPopup(false);

    // Simulate driver found after 5 seconds.
    driverTimerRef.current = setTimeout(() => {
      if (!noDriverFound && onDriverFound) {
        // Clear the no-driver timer to prevent later error triggers.
        if (noDriverTimerRef.current) clearTimeout(noDriverTimerRef.current);
        onDriverFound();
      }
    }, 5000);

    // After 10 seconds, assume no driver is found.
    noDriverTimerRef.current = setTimeout(() => {
      setNoDriverFound(true);
      setShowPopup(true);
      if (onDriverNotFound) {
        onDriverNotFound('No drivers available. Please try again later.');
      }
    }, 10000);
  }, [noDriverFound, onDriverFound, onDriverNotFound]);

  useEffect(() => {
    startSearch();
    return () => {
      if (driverTimerRef.current) clearTimeout(driverTimerRef.current);
      if (noDriverTimerRef.current) clearTimeout(noDriverTimerRef.current);
    };
  }, [startSearch]);

  const handleGoHome = () => {
    navigate('/dash');
  };

  const handleRetry = () => {
    startSearch();
  };

  return (
    <div className="find-driver-container">
      {/* Map Background */}
      <div className="map-background"></div>

      {/* Foreground Loading Content */}
      <div className="loading-container">
        {!noDriverFound && (
          <div className="pulse-container">
            <div className="pulse"></div>
            <div className="pulse"></div>
            <div className="pulse"></div>
          </div>
        )}
        <h2>Finding a Driver...</h2>
        {showPopup && (
          <div className="popup">
            <h3>No Drivers Found</h3>
            <p>We are sorry, but no drivers are currently available.</p>
            <div className="popup-buttons">
              <button onClick={handleGoHome}>Go Back Home</button>
              <button onClick={handleRetry}>Retry</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

FindDriver.propTypes = {
  onDriverFound: PropTypes.func.isRequired,
  onDriverNotFound: PropTypes.func,
};

export default FindDriver;
