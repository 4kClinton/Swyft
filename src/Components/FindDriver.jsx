import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../Styles/findDriver.css';
import { useDispatch, useSelector } from 'react-redux';
import { deleteOrder } from '../Redux/Reducers/CurrentOrderSlice';
import { removeDriver } from '../Redux/Reducers/DriverDetailsSlice';
import Cookies from 'js-cookie';
``;

const FindDriver = ({ onDriverFound, onDriverNotFound }) => {
  const navigate = useNavigate();
  const [noDriverFound, setNoDriverFound] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const driver = useSelector((state) => state.driverDetails.value);
  const order = useSelector((state) => state.currentOrder.value);
  const dispatch = useDispatch();

  useEffect(() => {
    if (driver?.id) {
      if (noDriverTimerRef.current) clearTimeout(noDriverTimerRef.current);
      onDriverFound();
    }
  }, [driver]);

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

    // After 30 seconds, assume no driver is found.
    noDriverTimerRef.current = setTimeout(() => {
      const token = Cookies.get('authTokencl1');

      fetch(`https://swyft-backend-client-nine.vercel.app/orders/${order.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: 'cancelled',
          cancellation_reason: 'Took too long',
        }),
      })
        .then((response) => {
          if (response.ok) {
            dispatch(deleteOrder());
            dispatch(removeDriver());
            setNoDriverFound(true);
            setShowPopup(true);
            Cookies.remove('NavigateToDriverDetails');
            if (onDriverNotFound) {
              onDriverNotFound('No drivers available. Please try again later.');
            }
          }
        })
        .catch((error) => {
          console.error('Error canceling order:', error);
        });
    }, 1000);
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
    setTimeout(() => window.location.reload(), 100);
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
        <h2 className="finder">Finding a Driver...</h2>
        {showPopup && (
          <div
            className="popup"
            style={{ display: showPopup ? 'block' : 'none' }}
          >
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
