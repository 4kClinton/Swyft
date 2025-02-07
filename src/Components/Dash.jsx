import { useState, useEffect, useRef } from 'react';
import '../Styles/Dash.css';

import ConfirmationPopup from './ConfirmationPopup';
import DateTimePopup from './DateTimePopup';
import LoaderPopup from './LoaderPopup';
import ErrorPopup from './ErrorPopup'; // New ErrorPopup
import SuccessPopup from './SuccessPopup'; // New SuccessPopup

import {
  FaTruckPickup,
  FaTruck,
  FaTruckMoving,
  FaCheckCircle,
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CancelOrderPopup from './CancelOrderPopup';
import Cookies from 'js-cookie';

//eslint-disable-next-line
const Dash = ({ distance = 0, userLocation, destination }) => {
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.user.value);

  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState('');
  const [calculatedCosts, setCalculatedCosts] = useState({});
  const [includeLoader, setIncludeLoader] = useState(false);
  const [numLoaders, setNumLoaders] = useState(1);
  const [showDateTimePopup, setShowDateTimePopup] = useState(false);
  const [showLoaderPopup, setShowLoaderPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [scheduleDateTime, setScheduleDateTime] = useState('');
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // New state for success popup
  const [startY, setStartY] = useState(0);
  const [endY, setEndY] = useState(0);
  const order = useSelector((state) => state.currentOrder.value);

  const theUser = useSelector((state) => state.user.value);

  const [isLoading, setIsLoading] = useState(false);

  const dashRef = useRef(null);

  // Rate and distance calculations
  const rates = {
    pickup: 160,
    miniTruck: 230,
    lorry: 310,
    flatbed: 350,
  };

  useEffect(() => {
    if (!user?.id) {
      navigate('/');
    }
  }, [user]);

  useEffect(() => {
    const newCalculatedCosts = Object.entries(rates).reduce(
      (acc, [vehicle, rate]) => {
        // Calculate base cost
        let calculatedCost = rate * distance;

        // Apply specific minimum logic for flatbed
        if (vehicle === 'flatbed') {
          calculatedCost = Math.max(calculatedCost, 3500);
        }

        // Enforce minimum cost of 1000 for all vehicles
        calculatedCost = Math.max(calculatedCost, 1000);

        // Add loader costs if applicable
        acc[vehicle] = Math.round(
          calculatedCost + (includeLoader ? 300 * numLoaders : 0)
        );

        return acc;
      },
      {}
    );

    setCalculatedCosts(newCalculatedCosts);
    //eslint-disable-next-line
  }, [distance, includeLoader, numLoaders, isLoading]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dashRef.current && !dashRef.current.contains(event.target))
        setIsOpen(false);
    };
    if (isOpen) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  // const toggleDash = () => setIsOpen(!isOpen);
  const handleOptionChange = (vehicle) => setSelectedOption(vehicle);
  const handleLoaderChange = (e) => setIncludeLoader(e.target.checked);
  const handleNumLoadersChange = (e) => {
    const value = parseInt(e.target.value);
    setNumLoaders(isNaN(value) ? 0 : Math.max(0, value));
  };
  const handleTouchStart = (e) => {
    setStartY(e.touches[0].clientY); // Capture the starting Y position
  };

  const handleTouchMove = (e) => {
    setEndY(e.touches[0].clientY); // Update the Y position as the user swipes
  };

  const handleTouchEnd = () => {
    if (startY === null || endY === null) return; // Ignore if values are not set

    const swipeDistance = startY - endY;
    const threshold = 50; // Minimum movement required to trigger swipe

    if (Math.abs(swipeDistance) >= threshold) {
      setIsOpen(swipeDistance > 0); // Swipe up opens, Swipe down closes
    }

    // Reset values to prevent false triggers
    setStartY(null);
    setEndY(null);
  };

  /*   const handleScheduleOrder = () => {
    if (!scheduleDateTime) {
      setErrorMessage('Please select a date and time for scheduling.');
      return;
    }

    const alertTime = new Date(scheduleDateTime).getTime();
    const currentTime = Date.now();
    const delay = alertTime - currentTime;

    if (delay > 0) {
      setTimeout(() => setShowSuccessPopup(true), delay); // Show success popup
      setShowSuccessPopup(true);
    } else {
      setErrorMessage('Please select a future date and time.');
    }
    setShowDateTimePopup(false); // Close the DateTimePopup after scheduling
  }; */

  const confirmOrder = async () => {
    Cookies.remove('driverData');

    //eslint-disable-next-line
    if (!destination.length < 0) {
      setErrorMessage('Please enter a destination location.');
      return;
    }
    if (!selectedOption) {
      setErrorMessage('Please select a vehicle.');
      return;
    }

    if (!theUser || !theUser.id || !theUser.name) {
      setErrorMessage('User details are missing. Please log in again.');
      // navigate("/")
      return;
    }

    // Construct the order data including user details
    const orderData = {
      id: theUser.id, // User ID
      vehicle: selectedOption,
      distance,
      loaders: includeLoader ? numLoaders : 0,
      loaderCost: includeLoader ? numLoaders * 300 : 0,
      totalCost: calculatedCosts[selectedOption],
      userLocation,
      destination,
      time: new Date().toLocaleString(),
    };

    setIsLoading(true); // Start loading state

    const token = Cookies.get('authTokencl1');

    try {
      const response = await fetch(
        'https://swyft-backend-client-git-nelson-4kclintons-projects.vercel.app/orders',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        }
      );

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(
          errorResult.error || 'Failed to place order, server error'
        );
      }

      setShowSuccessPopup(true);

      resetDash();

      // Reset the dashboard after a successful order
    } catch (error) {
      setIsLoading(false);
      setShowSuccessPopup(false);
      console.error('Error while placing order:', error);
      setErrorMessage(error.message); // Show error message
    }
  };
  useEffect(() => {
    if (order?.status === 'Accepted') {
      //check if the driver details has been shown before
      const navigated = Cookies.get('NavigateToDriverDetails');

      // If the details haven't been shown yet, display it
      if (!navigated) {
        navigate('/driverDetails');
        // Set the item in localStorage
        Cookies.set('NavigateToDriverDetails', 'true', { expires: 7 });
      }
    }
    if (!order?.id) {
      // Order is empty or deleted
      setShowSuccessPopup(false);

      setIsLoading(false);
    } else {
      // Order exists
      setIsLoading(true); // You can trigger loading if needed when order is being processed
    }

    //eslint-disable-next-line
  }, [order]);

  const resetDash = () => {
    // setSelectedOption("");
    setIncludeLoader(false);
    setNumLoaders(1);
    setCalculatedCosts(0);
    setErrorMessage('');
    setScheduleDateTime('');
  };

  const goBackToDash = () => {
    // resetDash();
    setShowSuccessPopup(false);
    setShowDateTimePopup(false);
    setShowConfirmationPopup(false);
  };

  const handlePopupClose = () => {
    // resetDash();
    setShowLoaderPopup(false);
    setErrorMessage('');
  };

  const handleCancelOrder = () => {
    setShowCancelPopup(true);
  };

  const closeCancelPopup = () => {
    setShowCancelPopup(false);
  };

  if (order?.id) {
    return (
      <div ref={dashRef} className={`Dash ${isOpen ? 'open' : ''}`}>
        <div className="notch">
          <div className="notch-indicator"></div>
        </div>
        <h2 className="catch">Current Order Details</h2>
        <div className="order-details">
          <p className="order-detail-item">
            <strong>Vehicle:</strong>{' '}
            {order.vehicle_type.charAt(0).toUpperCase() +
              order.vehicle_type.slice(1)}
          </p>

          <p className="order-detail-item">
            <strong>Loaders:</strong> {order.loaders}
          </p>
          <p className="order-detail-item">
            <strong>Distance:</strong> {order.distance} km
          </p>
          <p className="order-detail-item">
            <strong>Total Cost:</strong> Ksh {order.total_cost}
          </p>
        </div>
        <button
          className="cancel-button"
          style={{ backgroundColor: '#00d46a' }}
          onClick={() => navigate('/driverDetails')}
        >
          View driver details
        </button>
        <br /> <br />
        <button
          className="cancel-button"
          style={{ backgroundColor: 'red' }}
          onClick={handleCancelOrder}
        >
          Cancel Order
        </button>
        {showCancelPopup && <CancelOrderPopup onClose={closeCancelPopup} />}
      </div>
    );
  }

  return (
    <div
      key="dash"
      ref={dashRef}
      className={`Dash ${isOpen ? 'open' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="notch">
        <div className="notch-indicator"></div>
      </div>

      {/* Vehicle Selection */}
      {/* <PopupTutorial
        message="Click to Open"
        onDismiss={() => setShowPopup(true)}
      /> */}
      <h2 className="catch">Which means do you prefer?</h2>
      <div className="dash-content">
        {Object.entries(calculatedCosts)
          .filter(([vehicle]) => vehicle !== 'flatbed') // Exclude "flatbed" option
          .map(([vehicle, cost]) => {
            const Icon = {
              pickup: FaTruckPickup,
              miniTruck: FaTruck,
              lorry: FaTruckMoving,
            }[vehicle];
            return (
              <label
                key={vehicle}
                className="Option"
                onClick={() => handleOptionChange(vehicle)}
              >
                <div
                  className={`checkbox ${
                    selectedOption === vehicle ? 'selected' : ''
                  }`}
                >
                  <Icon size={24} />
                </div>
                {vehicle.charAt(0).toUpperCase() + vehicle.slice(1)} - Ksh{' '}
                {distance > 0 ? cost : '0'}
              </label>
            );
          })}
      </div>

      {/* Loader Option */}
      <div className="loader-option">
        <label>
          <input
            className="round-checkbox"
            type="checkbox"
            checked={includeLoader}
            onChange={handleLoaderChange}
          />
          Need a loader for unloading? (Ksh 300 per loader)
        </label>
        {includeLoader && (
          <input
            className="loader-input"
            type="number"
            value={numLoaders}
            onChange={handleNumLoadersChange}
            style={{ marginLeft: '10px', width: '50px' }}
          />
        )}
      </div>

      <div className="total-cost">
        <h3>Total Cost: Ksh {calculatedCosts[selectedOption] || '0'}</h3>
      </div>

      <div className="order-group">
        {/* Confirm and Schedule */}
        <button
          className="order-button"
          onClick={confirmOrder}
          disabled={isLoading} // Disable the button while loading
          style={{
            opacity: isLoading ? 0.7 : 1,
            width: '40vh',
            backgroundColor: '#00D46A',
          }} // Optional styling for loading state
        >
          {isLoading ? (
            <>
              Finding Driver...
              <span className="order-spinner" />
            </>
          ) : (
            <>
              Confirm Order
              <FaCheckCircle
                size={14}
                className="check-icon"
                style={{ marginLeft: '5px', width: '2vh' }}
              />
            </>
          )}
        </button>

        {/* Schedule Button with FaRegClock */}
        {/* <button className="order-button" onClick={handleSelectDateTime}>
    Schedule Move
    <FaRegClock
      size={14}
      className="check-icon"
      style={{ marginLeft: "5px" }}
    />
  </button> */}

        {/* Popups */}
        {errorMessage && (
          <ErrorPopup message={errorMessage} onClose={handlePopupClose} />
        )}
        {showConfirmationPopup && <ConfirmationPopup onClose={goBackToDash} />}
        {showSuccessPopup && <SuccessPopup onClose={goBackToDash} />}
        {showDateTimePopup && (
          <DateTimePopup
            scheduleDateTime={scheduleDateTime}
            setScheduleDateTime={setScheduleDateTime}
            onClose={() => setShowDateTimePopup(false)}
          />
        )}
        {showLoaderPopup && <LoaderPopup />}
      </div>
    </div>
  );
};

export default Dash;
