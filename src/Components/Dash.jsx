import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import '../Styles/Dash.css';

import ConfirmationPopup from './ConfirmationPopup';
import DateTimePopup from './DateTimePopup';
import LoaderPopup from './LoaderPopup';
import ErrorPopup from './ErrorPopup';
import SuccessPopup from './SuccessPopup';

import {
  FaTruckPickup,
  FaTruck,
  FaShuttleVan,
  FaCheckCircle,
} from 'react-icons/fa';

import { GiTowTruck } from 'react-icons/gi';
import { PiTruck } from 'react-icons/pi';
import { PiVan } from 'react-icons/pi';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CancelOrderPopup from './CancelOrderPopup';
import Cookies from 'js-cookie';
import { saveOrder } from '../Redux/Reducers/CurrentOrderSlice';

const Dash = ({ distance = 0, userLocation, destination }) => {
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

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
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // States for gradual dragging:
  const [startY, setStartY] = useState(null);
  const [offsetY, setOffsetY] = useState(0);

  const order = useSelector((state) => state.currentOrder.value);
  const Price = selectedOption ? calculatedCosts[selectedOption] : 0;
  const theUser = useSelector((state) => state.user.value);
  const [isLoading, setIsLoading] = useState(false);

  const dashRef = useRef(null);

  const rates = {
    pickup: 220,
    miniTruck: 270,
    van: 300,
    flatbed: 350,
    'Car Rescue': 400,
    tukTuk: 100,
    '10 Tonne Lorry': 500,
    '18 Tonne Lorry': 600,
    Tipper: 950,
  };

  const decayFactor = 0.005;
  const floorRate = 50;

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

  // Example Usage:
  console.log(calculateRate(rates.pickup, 1.5)); // 770
  console.log(calculateRate(rates.pickup, 2.5)); // 660
  console.log(calculateRate(rates.pickup, 4)); // 550
  console.log(calculateRate(rates.pickup, 8)); // 264
  console.log(calculateRate(rates.pickup, 15)); // Uses decay formula

  useEffect(() => {
    const newCalculatedCosts = Object.entries(rates).reduce(
      (acc, [vehicle, baseRate]) => {
        const adjustedRate = calculateRate(baseRate, distance);
        let calculatedCost = adjustedRate * distance;

        if (vehicle === 'flatbed') {
          calculatedCost = Math.max(calculatedCost, 3500);
        }

        calculatedCost = Math.max(calculatedCost, 1000);

        acc[vehicle] = Math.round(
          calculatedCost + (includeLoader ? 600 * numLoaders : 0)
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

  const handleOptionChange = (vehicle) => {
    if (!isOpen) {
      setIsOpen(true);
    }
    setSelectedOption(vehicle);
  };

  const handleLoaderChange = (e) => setIncludeLoader(e.target.checked);
  const handleNumLoadersChange = (e) => {
    const value = parseInt(e.target.value);
    setNumLoaders(isNaN(value) ? 0 : Math.max(0, value));
  };

  // Touch handlers for gradual dragging
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

  console.log(calculatedCosts);

  const confirmOrder = async () => {
    Cookies.remove('driverData');

    if (destination.length === 0) {
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
    dispatch(saveOrder(orderData));

    navigate('/confirmOrder', { state: { orderData } });
  };

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
    //eslint-disable-next-line
  }, [order]);

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

  useEffect(() => {
    if (!theUser?.id) {
      navigate('/');
    }
  }, [theUser, navigate]);

  if (order?.id) {
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
      <div className="dash-content">
        {/* Mini Cargo */}
        <h2>Mini Cargo</h2>
        {Object.entries(calculatedCosts)
          .filter(([vehicle]) => ['pickup', 'tukTuk'].includes(vehicle))
          .map(([vehicle, cost]) => {
            const Icon = {
              pickup: FaTruckPickup,
              tukTuk: PiVan,
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

        {/* Medium Cargo */}
        <h2>Medium Cargo</h2>
        {Object.entries(calculatedCosts)
          .filter(([vehicle]) => ['miniTruck', 'van'].includes(vehicle))
          .map(([vehicle, cost]) => {
            const Icon = {
              miniTruck: FaTruck,
              van: FaShuttleVan,
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

        {/* Bulk Cargo */}
        <h2>Bulk Cargo</h2>
        {Object.entries(calculatedCosts)
          .filter(([vehicle]) =>
            [
              'Car Rescue',
              '10 Tonne Lorry',
              '18 Tonne Lorry',
              'Tipper',
            ].includes(vehicle)
          )
          .map(([vehicle, cost]) => {
            const Icon = {
              'Car Rescue': GiTowTruck,
              '10 Tonne Lorry': PiTruck,
              '18 Tonne Lorry': PiTruck,
              Tipper: PiTruck,
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
          Need a loader for unloading? (Ksh 600 per loader)
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
  userLocation: PropTypes.string,
  destination: PropTypes.string,
};

Dash.defaultProps = {
  distance: 0,
  userLocation: '',
  destination: '',
};

export default Dash;
