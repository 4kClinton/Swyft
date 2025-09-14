// Part 1 of 2

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import '../Styles/Dash.css';
import { FaHome, FaBuilding, FaWarehouse } from 'react-icons/fa';
import { MdHouse, MdApartment } from 'react-icons/md';
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
} from 'react-icons/fa';

import { GiTowTruck } from 'react-icons/gi';
import { PiTruck } from 'react-icons/pi';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useNavigationType } from 'react-router-dom';
import CancelOrderPopup from './CancelOrderPopup';
import Cookies from 'js-cookie';
import { deleteOrder, saveOrder } from '../Redux/Reducers/CurrentOrderSlice';

const Dash = ({ distance = 0, userLocation = '', destination = '' }) => {
  const navigationType = useNavigationType();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (navigationType === 'POP') {
      dispatch(deleteOrder());
      localStorage.removeItem('currentOrder');
    }
  }, [navigationType, dispatch]);

  const [activeTab, setActiveTab] = useState('Cargo');
  const [isTabLoading, setIsTabLoading] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    setIsTabLoading(true);
    const timer = setTimeout(() => {
      setIsTabLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const [selectedOption, setSelectedOption] = useState('');
  const [includeLoader, setIncludeLoader] = useState(false);
  const [numLoaders, setNumLoaders] = useState(1);

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

  const rates = useMemo(
    () => ({
      SwyftBoda: 30,
      SwyftBodaElectric: 20,
      car: 50,
      van: 210,
      miniTruck: 250,
      pickup: 220,
      carRescue: 400,
      lorry5Tonne: 800,
      lorry10Tonne: 1200,
    }),
    []
  );

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

  const packingDefaults = useMemo(
    () => ({
      studio: { boxes: 10, tape: 2, blankets: 1, wrap: 1, bubble: 1 },
      oneBedroom: { boxes: 15, tape: 3, blankets: 2, wrap: 1, bubble: 1 },
      twoBedroom: { boxes: 20, tape: 4, blankets: 3, wrap: 1, bubble: 1 },
      threeBedroom: { boxes: 25, tape: 5, blankets: 4, wrap: 1, bubble: 1 },
      fourBedroom: { boxes: 30, tape: 6, blankets: 5, wrap: 1, bubble: 1 },
      fiveBedroom: { boxes: 40, tape: 8, blankets: 6, wrap: 1, bubble: 2 },
    }),
    []
  );

  const materialRates = useMemo(
    () => ({
      box: 150,
      tape: 150,
      blanket: 500,
      wrap: 600,
      bubble: 800,
    }),
    []
  );

  const calculatePackingCost = useCallback(
    (config) => {
      return (
        config.boxes * materialRates.box +
        config.tape * materialRates.tape +
        config.blankets * materialRates.blanket +
        config.wrap * materialRates.wrap +
        config.bubble * materialRates.bubble
      );
    },
    [materialRates]
  );

  const movingRates = useMemo(
    () => ({
      studio: {
        transport: calculateRate(rates.pickup, distance) * distance,
        loaders: 2,
        packingCost: calculatePackingCost(packingDefaults.studio),
      },
      oneBedroom: {
        transport: calculateRate(rates.pickup, distance) * distance,
        loaders: 2,
        packingCost: calculatePackingCost(packingDefaults.oneBedroom),
      },
      twoBedroom: {
        transport: calculateRate(rates.miniTruck, distance) * distance,
        loaders: 3,
        packingCost: calculatePackingCost(packingDefaults.twoBedroom),
      },
      threeBedroom: {
        transport: calculateRate(rates.miniTruck, distance) * distance,
        loaders: 3,
        packingCost: calculatePackingCost(packingDefaults.threeBedroom),
      },
      fourBedroom: {
        transport: calculateRate(rates.lorry5Tonne, distance) * distance,
        loaders: 4,
        packingCost: calculatePackingCost(packingDefaults.fourBedroom),
      },
      fiveBedroom: {
        transport: calculateRate(rates.lorry10Tonne, distance) * distance,
        loaders: 5,
        packingCost: calculatePackingCost(packingDefaults.fiveBedroom),
      },
    }),
    [
      distance,
      rates,
      calculatePackingCost,
      packingDefaults.studio,
      packingDefaults.oneBedroom,
      packingDefaults.twoBedroom,
      packingDefaults.threeBedroom,
      packingDefaults.fourBedroom,
      packingDefaults.fiveBedroom,
    ]
  );

  useEffect(() => {
    const newCalculatedCosts = Object.entries(rates).reduce(
      (acc, [vehicleKey, baseRate]) => {
        const adjustedRate = calculateRate(baseRate, distance);
        let calculatedCost = adjustedRate * distance;
        if (!['car', 'SwyftBoda', 'SwyftBodaElectric'].includes(vehicleKey)) {
          calculatedCost = Math.max(calculatedCost, 1000);
        }
        acc[vehicleKey] = Math.round(
          calculatedCost + (includeLoader ? 600 * numLoaders : 0)
        );
        return acc;
      },
      {}
    );

    const newMovingCosts = Object.entries(movingRates).reduce(
      (acc, [homeKey, config]) => {
        const labourCost = config.loaders * 600;
        const subTotal = config.transport + labourCost + config.packingCost;
        const serviceFee = Math.round(subTotal * 0.1);
        acc[homeKey] = subTotal + serviceFee + 3000; // <-- add 5000 to each moving cost
        return acc;
      },
      {}
    );

    setCalculatedCosts({ ...newCalculatedCosts, ...newMovingCosts });
  }, [distance, includeLoader, numLoaders, rates, movingRates]);

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
  // Part 2 of 2

  useEffect(() => {
    localStorage.setItem('selectedOption', selectedOption);
  }, [selectedOption]);

  useEffect(() => {
    localStorage.setItem('includeLoader', JSON.stringify(includeLoader));
  }, [includeLoader]);

  useEffect(() => {
    localStorage.setItem('numLoaders', numLoaders.toString());
  }, [numLoaders]);

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

  const handleOptionChange = (optionKey) => {
    if (!isOpen) {
      setIsOpen(true);
    }
    setSelectedOption(optionKey);
  };

  const handleLoaderChange = (e) => setIncludeLoader(e.target.checked);
  const handleNumLoadersChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setNumLoaders(isNaN(value) ? 0 : Math.max(0, value));
  };

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

  const confirmOrder = async () => {
    try {
      Cookies.remove('driverData');
      localStorage.removeItem('order_id');
      localStorage.removeItem('driver_id');
      localStorage.removeItem('car');
      localStorage.removeItem('name');
      localStorage.removeItem('phone');
      localStorage.removeItem('status');
      localStorage.removeItem('license');
      localStorage.removeItem('currentOrder');
      dispatch(deleteOrder());

      if (destination.length === 0) {
        throw new Error('Please enter a destination location.');
      }
      if (!selectedOption) {
        throw new Error('Please select an option.');
      }
      if (!theUser || !theUser.id || !theUser.name) {
        throw new Error('User details are missing. Please log in again.');
      }
      function formatLocation(loc) {
        if (!loc) return '';
        if (typeof loc === 'string') return loc;

        // if loc has lat/lng, return a Google Maps link
        if (loc.lat && loc.lng) {
          return `https://www.google.com/maps?q=${loc.lat},${loc.lng}`;
        }

        return loc.name || loc.address || loc.label || '';
      }

      const isMoving = [
        'studio',
        'oneBedroom',
        'twoBedroom',
        'threeBedroom',
        'fourBedroom',
        'fiveBedroom',
      ].includes(selectedOption);

      const orderData = isMoving
        ? {
            moveType: selectedOption,
            distance: parseFloat(distance).toFixed(3),
            loaders: movingRates[selectedOption].loaders,
            packingCost: movingRates[selectedOption].packingCost,
            serviceFee:
              calculatedCosts[selectedOption] -
              (movingRates[selectedOption].transport +
                movingRates[selectedOption].loaders * 600 +
                movingRates[selectedOption].packingCost),
            totalCost: calculatedCosts[selectedOption],
            userLocation,
            destination,
            time: new Date().toLocaleString(),
          }
        : {
            vehicle: selectedOption,
            distance: parseFloat(distance).toFixed(3),
            loaders: includeLoader ? numLoaders : 0,
            loaderCost: includeLoader ? numLoaders * 600 : 0,
            totalCost: Price,
            userLocation,
            destination,
            time: new Date().toLocaleString(),
          };

      if (isMoving) {
        const message =
          `*New Moving Order* 🚚\n\n` +
          `*Home:* ${orderData.moveType}\n` +
          `*Distance:* ${parseFloat(orderData.distance).toFixed(1)} km\n` +
          `*Pickup:* ${formatLocation(orderData.userLocation)}\n\n` +
          `*Drop-off:* ${formatLocation(orderData.destination)}\n\n` +
          `*Loaders:* ${orderData.loaders}\n` +
          `*Total:* Ksh ${Math.round(orderData.totalCost).toLocaleString('en-KE')}`;

        window.open(
          `https://wa.me/254796652112?text=${encodeURIComponent(message)}`
        );
      } else {
        // 🔹 Transport orders → save locally (Redux + localStorage)
        dispatch(saveOrder(orderData));
        localStorage.setItem('currentOrder', JSON.stringify(orderData));
        navigate('/confirmOrder', { state: { orderData } });
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
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

  const closeCancelPopup = () => {
    setShowCancelPopup(false);
  };

  useEffect(() => {
    if (!theUser?.id) {
      navigate('/');
    }
  }, [theUser, navigate]);

  const renderOptions = (options) => {
    return options.map(({ key, label, Icon }) => {
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
            {Icon && <Icon size={24} />}
          </div>
          {`${label} - Ksh ${distance > 0 ? cost : '0'}`}
        </label>
      );
    });
  };

  const miniCargo = [{ key: 'van', label: ' Van', Icon: FaShuttleVan }];
  const mediumCargo = [
    { key: 'miniTruck', label: ' Mini Truck', Icon: FaTruck },
    { key: 'pickup', label: ' Pickup', Icon: FaTruckPickup },
  ];
  const bulkCargo = [
    { key: 'carRescue', label: ' Car Rescue', Icon: GiTowTruck },
    { key: 'lorry5Tonne', label: ' Lorry 5 Tonne', Icon: PiTruck },
    { key: 'lorry10Tonne', label: ' Lorry 10 Tonne', Icon: PiTruck },
  ];

  const movingHomes = [
    {
      title: 'Starter Homes',
      homes: [
        { key: 'studio', label: 'Studio', Icon: MdHouse },
        { key: 'oneBedroom', label: '1 bedroom', Icon: FaHome },
      ],
    },
    {
      title: 'Comfort Homes',
      homes: [
        { key: 'twoBedroom', label: '2 bedroom', Icon: MdApartment },
        { key: 'threeBedroom', label: '3 bedroom', Icon: FaBuilding },
      ],
    },
    {
      title: 'Spacious Homes',
      homes: [
        { key: 'fourBedroom', label: '4 bedroom', Icon: FaWarehouse },
        { key: 'fiveBedroom', label: '5+ bedroom', Icon: FaWarehouse },
      ],
    },
  ];

  // Helper to format price with commas
  const formatPrice = (price) =>
    price ? price.toLocaleString('en-KE', { maximumFractionDigits: 0 }) : '0';

  // Update renderOptions to support icons and formatted price
  const renderMovingOptions = (homes) => {
    return homes.map(({ key, label, Icon }) => {
      const cost = distance > 0 ? calculatedCosts[key] || 0 : 0;
      return (
        <label
          key={key}
          className="Option"
          onClick={() => handleOptionChange(key)}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '1rem',

            background: selectedOption === key ? '#f6fff9' : '#fff',
            borderRadius: '2rem',
            border:
              selectedOption === key ? '2px solid #00c763' : '1px solid #eee',
            padding: '0.7rem 1rem',
            boxShadow: selectedOption === key ? '0 0 8px #00c76322' : 'none',
            cursor: 'pointer',
          }}
        >
          <div
            className={`checkbox ${selectedOption === key ? 'selected' : ''}`}
            style={{
              marginRight: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',

              width: 40,
              fontWeight: 500,
              height: 40,
              borderRadius: '50%',
              border:
                selectedOption === key ? '2px solid #00c763' : '1px solid #ccc',
              background: '#fff',
            }}
          >
            {Icon && (
              <Icon
                size={28}
                color={selectedOption === key ? '#00c763' : '#bbb'}
              />
            )}
          </div>
          <span style={{ flex: 1, fontWeight: 700, fontSize: '1.0rem' }}>
            {label}
          </span>
          <span style={{ fontWeight: 600, fontSize: '1.1rem', color: '#222' }}>
            - Ksh {formatPrice(cost)}
          </span>
        </label>
      );
    });
  };

  let tabContent;
  if (isTabLoading) {
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
        {renderOptions(miniCargo)}
        <h2>Medium Cargo</h2>
        {renderOptions(mediumCargo)}
        <h2>Bulk Cargo</h2>
        {renderOptions(bulkCargo)}
      </>
    );
  } else if (activeTab === 'Parcels') {
    tabContent = <TripTracker />;
  } else if (activeTab === 'Moving') {
    tabContent = (
      <>
        {/* <h2
          style={{ textAlign: 'center', marginBottom: '1rem', fontWeight: 700 }}
        >
          Select House Size
        </h2> */}
        {movingHomes.map((group) => (
          <div key={group.title} style={{ marginBottom: '1.5rem' }}>
            <h3
              style={{
                margin: '0 0 0.5rem 0',
                textAlign: 'justify',
                fontWeight: 600,
                fontSize: '1.2rem',
                color: '#00c763',
              }}
            >
              {group.title}
            </h3>
            {renderMovingOptions(group.homes)}
          </div>
        ))}
      </>
    );
  }

  // ======= Show Current Order for Transport =======
  if (
    order?.id &&
    order?.vehicle_type &&
    ![
      'studio',
      'oneBedroom',
      'twoBedroom',
      'threeBedroom',
      'fourBedroom',
      'fiveBedroom',
    ].includes(order.vehicle_type)
  ) {
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
          <p>
            <strong>Vehicle:</strong> {order.vehicle_type}
          </p>
          <p>
            <strong>Loaders:</strong> {order.loaders}
          </p>
          <p>
            <strong>Distance:</strong> {order.distance} km
          </p>
          <p>
            <strong>Total Cost:</strong> Ksh {order.total_cost}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
        </div>
        <button
          className="cancel-button"
          style={{ backgroundColor: '#00d46a' }}
          onClick={() => navigate('/driverDetails')}
        >
          View driver details
        </button>
        <br />
        <br />

        <button
          className="cancel-button"
          style={{ backgroundColor: 'red' }}
          onClick={() => setShowCancelPopup(true)} // ✅ just open popup, don't clear order yet
        >
          Cancel Order
        </button>

        {showCancelPopup && (
          <CancelOrderPopup
            orderId={order?.id} // ✅ pass the order id to the popup
            onClose={closeCancelPopup}
          />
        )}

        {showCancelPopup && <CancelOrderPopup onClose={closeCancelPopup} />}
      </div>
    );
  }

  console.log('Order from Redux:', order);

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
      <SortingTabs onTabChange={handleTabChange} />
      <div className="dash-content">{tabContent}</div>
      {activeTab !== 'Moving' && (
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
      )}
      <div className="total-cost">
        <h3>
          Total Cost: Ksh{' '}
          {distance > 0 ? formatPrice(calculatedCosts[selectedOption]) : '0'}
        </h3>
      </div>
      <div className="order-group">
        <button
          className="order-button"
          onClick={confirmOrder}
          disabled={isLoading}
          style={{
            opacity: isLoading ? 0.7 : 1,
            width: '40vh',
            backgroundColor: '#00c763',
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
      {showCancelPopup && <CancelOrderPopup onClose={closeCancelPopup} />}
    </div>
  );
};

Dash.propTypes = {
  distance: PropTypes.number,
  userLocation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  destination: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default Dash;
