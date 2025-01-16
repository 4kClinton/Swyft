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

//eslint-disable-next-line
const Dash = ({ distance = 0, userLocation, destination }) => {
  const [isOpen, setIsOpen] = useState(false);
  const driver = useSelector((state) => state.driverDetails.value);

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
  }, [distance, includeLoader, numLoaders]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dashRef.current && !dashRef.current.contains(event.target))
        setIsOpen(false);
    };
    if (isOpen) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  const toggleDash = () => setIsOpen(!isOpen);
  const handleOptionChange = (vehicle) => setSelectedOption(vehicle);
  const handleLoaderChange = (e) => setIncludeLoader(e.target.checked);
  const handleNumLoadersChange = (e) => {
    const value = parseInt(e.target.value);
    setNumLoaders(isNaN(value) ? 0 : Math.max(0, value));
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
  console.log('dest:', destination);
  const confirmOrder = async () => {
    localStorage.removeItem('driverData');
    console.log(driver);
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

    const token = sessionStorage.getItem('authToken');

    try {
      const response = await fetch(
        'https://swyft-backend-client-nine.vercel.app/orders',
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
        throw new Error('Failed to place order, server error');
      }

      const result = await response.json();
      console.log('Order placed successfully:', result);

      setShowLoaderPopup(false); // Close loader popup
      setShowSuccessPopup(true); // Show success popup
      resetDash();

      // Reset the dashboard after a successful order
    } catch (error) {
      console.error('Error while placing order:', error);
      setErrorMessage('Failed to place order. Please try again.'); // Show error message
    } finally {
      setIsLoading(false); // End loading state
    }
  };

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
    setShowDateTimePopup(false);
    setShowConfirmationPopup(false);
  };

  const handlePopupClose = () => {
    // resetDash();
    setShowLoaderPopup(false);
    setErrorMessage('');
  };

  return (
    <div
      key={distance}
      ref={dashRef}
      className={`Dash ${isOpen ? 'open' : ''}`}
    >
      <div className="notch" onClick={toggleDash}>
        <div className="notch-indicator"></div>
      </div>

      {/* Vehicle Selection */}
      {/* <PopupTutorial
        message="Click to Open"
        onDismiss={() => setShowPopup(true)}
      /> */}
      <h2 className="catch" onClick={toggleDash}>
        Which means do you prefer?
      </h2>
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
              Placing Order...
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
