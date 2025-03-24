import { useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import '../Styles/Dash.css';

import ConfirmationPopup from './ConfirmationPopup';
import DateTimePopup from './DateTimePopup';
import LoaderPopup from './LoaderPopup';
import ErrorPopup from './ErrorPopup';
import SuccessPopup from './SuccessPopup';
import SortingTabs from './SortingTabs';
import TripTracker from './TripTracker';

import {
  FaTruckPickup,
  FaTruck,
  FaShuttleVan,
  FaCheckCircle,
  FaMotorcycle, // For SwyftBoda
  FaCar, // For car
} from 'react-icons/fa';

import { GiTowTruck } from 'react-icons/gi';
import { PiTruck } from 'react-icons/pi';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useNavigationType } from 'react-router-dom';
import CancelOrderPopup from './CancelOrderPopup';
import Cookies from 'js-cookie';
import { deleteOrder, saveOrder } from '../Redux/Reducers/CurrentOrderSlice';

const Dash = ({ distance = 0, userLocation = '', destination = '' }) => {
  // Listen for navigation type (POP, PUSH, REPLACE)
  const navigationType = useNavigationType();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Clear order if user navigates back via browser button
  useEffect(() => {
    if (navigationType === 'POP') {
      dispatch(deleteOrder());
      localStorage.removeItem('currentOrder');
    }
  }, [navigationType, dispatch]);

  // ======= NEW: Tab State & Loading for the tab switch =======
  const [activeTab, setActiveTab] = useState('Cargo');
  const [isTabLoading, setIsTabLoading] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Simulate a short loading period whenever activeTab changes
  useEffect(() => {
    setIsTabLoading(true);
    const timer = setTimeout(() => {
      setIsTabLoading(false);
    }, 800); // 0.8s mock loading
    return () => clearTimeout(timer);
  }, [activeTab]);

  // ======= Local storage states =======
  const [selectedOption, setSelectedOption] = useState('');
  const [includeLoader, setIncludeLoader] = useState(false);
  const [numLoaders, setNumLoaders] = useState(1);

  // ======= Other component states =======
  const [calculatedCosts, setCalculatedCosts] = useState({});
  const [showDateTimePopup, setShowDateTimePopup] = useState(false);
  const [showLoaderPopup, setShowLoaderPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [scheduleDateTime, setScheduleDateTime] = useState('');
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [startY, setStartY] = useState(null);
  const [offsetY, setOffsetY] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);

  const dashRef = useRef(null);
  const order = useSelector((state) => state.currentOrder.value);
  const theUser = useSelector((state) => state.user.value);
  const Price = selectedOption ? calculatedCosts[selectedOption] : 0;

  // ======= 1. Define your rates for each vehicle type =======
  const rates = useMemo(
    () => ({
      SwyftBoda: 30,
      SwyftBodaElectric: 20,
      car: 50,
      van: 210,
      miniTruck: 270,
      pickup: 220,
      carRescue: 400,
      lorry5Tonne: 800,
      lorry10Tonne: 1200,
    }),
    []
  );

  // Distance cost constants
  const decayFactor = 0.005;
  const floorRate = 50;

  // ======= 2. Cost calculation logic =======
  const calculateRate = (baseRate, distance) => {
    if (distance < 2) {
      return baseRate * 3.5;
    } else if (distance < 3) {
      return baseRate * 3;
    } else if (distance < 5) {
      return baseRate * 2.5;
    } else if (distance < 10) {
      return baseRate * 1.2;
    } else {
      return Math.max(baseRate * Math.exp(-decayFactor * distance), floorRate);
    }
  };

  useEffect(() => {
    console.log('Pickup rate for 1.5 km:', calculateRate(rates.pickup, 1.5));
    console.log('Pickup rate for 2.5 km:', calculateRate(rates.pickup, 2.5));
    console.log('Pickup rate for 4 km:', calculateRate(rates.pickup, 4));
    console.log('Pickup rate for 8 km:', calculateRate(rates.pickup, 8));
    console.log('Pickup rate for 15 km:', calculateRate(rates.pickup, 15));
  }, [rates]);

  // Recalculate costs whenever dependencies change
  useEffect(() => {
    const newCalculatedCosts = Object.entries(rates).reduce(
      (acc, [vehicleKey, baseRate]) => {
        const adjustedRate = calculateRate(baseRate, distance);
        let calculatedCost = adjustedRate * distance;
        // For vehicles other than 'car', 'SwyftBoda', and 'SwyftBodaElectric', apply the minimum cost of Ksh 1000.
        if (!['car', 'SwyftBoda', 'SwyftBodaElectric'].includes(vehicleKey)) {
          calculatedCost = Math.max(calculatedCost, 1000);
        }
        // Add loader costs if applicable
        acc[vehicleKey] = Math.round(
          calculatedCost + (includeLoader ? 600 * numLoaders : 0)
        );
        return acc;
      },
      {}
    );
    setCalculatedCosts(newCalculatedCosts);
  }, [distance, includeLoader, numLoaders, rates]);

  // ======= 3. Load & save user selections to local storage =======
  useEffect(() => {
    const storedSelectedOption = localStorage.getItem('selectedOption');
    if (storedSelectedOption) setSelectedOption(storedSelectedOption);

    const storedIncludeLoader = localStorage.getItem('includeLoader');
    if (storedIncludeLoader) {
      setIncludeLoader(JSON.parse(storedIncludeLoader));
    }

    const storedNumLoaders = localStorage.getItem('numLoaders');
    if (storedNumLoaders) {
      setNumLoaders(parseInt(storedNumLoaders, 10));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedOption', selectedOption);
  }, [selectedOption]);

  useEffect(() => {
    localStorage.setItem('includeLoader', JSON.stringify(includeLoader));
  }, [includeLoader]);

  useEffect(() => {
    localStorage.setItem('numLoaders', numLoaders.toString());
  }, [numLoaders]);

  // ======= 4. Panel open/close logic =======
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dashRef.current && !dashRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  const handleOptionChange = (vehicleKey) => {
    if (!isOpen) {
      setIsOpen(true);
    }
    setSelectedOption(vehicleKey);
  };

  const handleLoaderChange = (e) => setIncludeLoader(e.target.checked);
  const handleNumLoadersChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setNumLoaders(isNaN(value) ? 0 : Math.max(0, value));
  };

  // ======= 5. Touch handlers for dragging the panel =======
  const panelHeight = 300;
  const handleTouchStart = (e) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    if (startY !== null) {
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;
      setOffsetY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    const closedPosition = panelHeight;
    const baseTranslate = isOpen ? 0 : closedPosition;
    const finalTranslate = baseTranslate + offsetY;
    if (finalTranslate < closedPosition / 2) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
    setOffsetY(0);
    setStartY(null);
  };

  const closedPosition = panelHeight;
  const baseTranslate = isOpen ? 0 : closedPosition;
  const translateY =
    startY !== null
      ? Math.min(Math.max(baseTranslate + offsetY, 0), closedPosition)
      : baseTranslate;

  const dashStyle = {
    transform: `translateY(${translateY}px)`,
    transition: startY !== null ? 'none' : 'transform 0.3s ease-out',
  };

  // ======= 6. Confirm order logic =======
  const confirmOrder = async () => {
    try {
      Cookies.remove('driverData');

      if (destination.length === 0) {
        throw new Error('Please enter a destination location.');
      }
      if (!selectedOption) {
        throw new Error('Please select a vehicle.');
      }
      if (!theUser || !theUser.id || !theUser.name) {
        throw new Error('User details are missing. Please log in again.');
      }

      const orderData = {
        id: theUser.id,
        vehicle: selectedOption,
        distance: parseFloat(distance).toFixed(3),
        loaders: includeLoader ? numLoaders : 0,
        loaderCost: includeLoader ? numLoaders * 600 : 0,
        totalCost: Price,
        userLocation,
        destination,
        time: new Date().toLocaleString(),
      };

      // Save order details in Redux and local storage.
      dispatch(saveOrder(orderData));
      localStorage.setItem('currentOrder', JSON.stringify(orderData));

      navigate('/confirmOrder', { state: { orderData } });
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  // ======= 7. If order is accepted, navigate to driver details =======
  useEffect(() => {
    if (order?.status === 'Accepted') {
      const navigated = Cookies.get('NavigateToDriverDetails');
      if (!navigated) {
        navigate('/driverDetails');
        Cookies.set('NavigateToDriverDetails', 'true');
      }
    }
    if (!order?.id) {
      setShowSuccessPopup(false);
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [order, navigate]);

  const goBackToDash = () => {
    setShowSuccessPopup(false);
    setShowDateTimePopup(false);
    setShowConfirmationPopup(false);
  };

  const handlePopupClose = () => {
    setShowLoaderPopup(false);
    setErrorMessage('');
  };

  const handleCancelOrder = () => {
    setShowCancelPopup(true);
  };

  const closeCancelPopup = () => {
    setShowCancelPopup(false);
  };

  // If user not logged in, redirect
  useEffect(() => {
    if (!theUser?.id) {
      navigate('/');
    }
  }, [theUser, navigate]);

  // ======= 8. If there's an existing order, show "Current Order" =======
  if (order?.id && order?.vehicle_type) {
    return (
      <div
        ref={dashRef}
        className={`OrderDash ${isOpen ? 'open' : ''}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={dashStyle}
      >
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

  // ======= 9. Main Dash UI: show tab-based vehicles =======
  // Helper: Render vehicles with label, icon, cost
  const renderVehicleOptions = (vehicles) => {
    return vehicles.map(({ key, label, Icon }) => {
      const cost = calculatedCosts[key] || 0;
      return (
        <label
          key={key}
          className="Option"
          onClick={() => handleOptionChange(key)}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <div
            className={`checkbox ${selectedOption === key ? 'selected' : ''}`}
            style={{ marginRight: '1rem' }}
          >
            <Icon size={24} />
          </div>
          {`${label} - Ksh ${distance > 0 ? cost : '0'}`}
        </label>
      );
    });
  };

  // Vehicles for each sub-category of Cargo
  const miniCargo = [{ key: 'van', label: 'Swyft Van', Icon: FaShuttleVan }];

  const mediumCargo = [
    { key: 'miniTruck', label: 'Swyft MiniTruck', Icon: FaTruck },
    { key: 'pickup', label: 'Swyft Pickup', Icon: FaTruckPickup },
  ];

  const bulkCargo = [
    { key: 'carRescue', label: 'Swyft Car Rescue', Icon: GiTowTruck },

    { key: 'lorry5Tonne', label: 'Swyft Lorry 5 Tonne', Icon: PiTruck },
    { key: 'lorry10Tonne', label: 'Swyft Lorry 10 Tonne', Icon: PiTruck },
  ];

  // Vehicles for Parcels
  const parcelVehicles = [
    { key: 'SwyftBoda', label: 'Swyft Boda', Icon: FaMotorcycle },
    {
      key: 'SwyftBodaElectric',
      label: 'Swyft Boda Electric',
      Icon: FaMotorcycle,
    },
    { key: 'car', label: 'Swyft Car', Icon: FaCar },
  ];

  // Vehicles for Moving
  const movingVehicles = [
    { key: 'pickup', label: 'Swyft Pickup', Icon: FaTruckPickup },
    { key: 'miniTruck', label: 'Swyft MiniTruck', Icon: FaTruck },

    { key: 'lorry5Tonne', label: 'Swyft Lorry 5 Tonne', Icon: PiTruck },
    { key: 'lorry10Tonne', label: 'Swyft Lorry 10 Tonne', Icon: PiTruck },
  ];

  // Decide what to render based on activeTab
  let tabContent;
  if (isTabLoading) {
    // Show a circular loader if we're "fetching" vehicles
    tabContent = (
      <div
        style={{
          textAlign: 'center',
          marginTop: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="order-spinner" />
      </div>
    );
  } else if (activeTab === 'Cargo') {
    tabContent = (
      <>
        <h2>Mini Cargo</h2>
        {renderVehicleOptions(miniCargo)}

        <h2>Medium Cargo</h2>
        {renderVehicleOptions(mediumCargo)}

        <h2>Bulk Cargo</h2>
        {renderVehicleOptions(bulkCargo)}
      </>
    );
  } else if (activeTab === 'Parcels') {
    tabContent = (
      <>
        <TripTracker />
      </>
    )
  } else if (activeTab === 'Moving') {
    tabContent = <>{renderVehicleOptions(movingVehicles)}</>;
  }

  return (
    <div
      key="dash"
      ref={dashRef}
      className={`Dash ${isOpen ? 'open' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={dashStyle}
    >
      <div className="notch">
        <div className="notch-indicator"></div>
      </div>
      <h2 className="catch">What’s Your Load Today?</h2>

      {/* Pass handleTabChange so Dash knows which tab is selected */}
      <SortingTabs onTabChange={handleTabChange} />

      <div className="dash-content">{tabContent}</div>

      {/* Loader Option */}
      <div className="loader-option">
        <label>
          <input
            className="round-checkbox"
            type="checkbox"
            checked={includeLoader}
            onChange={handleLoaderChange}
          />
          Need a loader for loading & unloading? (Ksh 600 per loader)
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
        <button
          className="order-button"
          onClick={confirmOrder}
          disabled={isLoading}
          style={{
            opacity: isLoading ? 0.7 : 1,
            width: '40vh',
            backgroundColor: '#00D46A',
          }}
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

Dash.propTypes = {
  distance: PropTypes.number,
  userLocation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  destination: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default Dash;
