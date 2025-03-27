import '../Styles/OrderDetailsConfirmation.css';
import { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// Import vehicle images
import TukTuk from '../assets/TukTuk.jpg';
import Pickup from '../assets/pickup.png';
import MiniTruck from '../assets/miniTruck.png';
import TenTonne from '../assets/10T-Lorry.jpg';
import fiveTonne from '../assets/5tonne.png';
import Van from '../assets/van.jpg';
import Tipper from '../assets/Tipper.jpg';
import CarRescue from '../assets/Towin.jpg';
import nduthi from '../assets/nduthi.png';
import moti from '../assets/moti.png';
import nduthiElectric from '../assets/Electric.png';

// Import the separate FindDriver component
import FindDriver from './FindDriver';

// Material UI components for dialogs and icons
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import ErrorIcon from '@mui/icons-material/ErrorOutline';
import { useDispatch, useSelector } from 'react-redux';
import { deleteOrder } from '../Redux/Reducers/CurrentOrderSlice';

export default function OrderConfirmation() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // Payment and receiver state
  const [selectedPayment, setSelectedPayment] = useState('sender');
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');

  // Package Type state and popup
  const [packageType, setPackageType] = useState('');
  const [showPackagePopup, setShowPackagePopup] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isFindingDriver, setIsFindingDriver] = useState(false);

  // Address states for user location and destination
  const [destinationAddress, setDestinationAddress] = useState(null);
  const [userLocationAddress, setUserLocationAddress] = useState(null);

  // Get order data from Redux; if missing, try local storage.
  const orderDataRedux = useSelector((state) => state.currentOrder.value);
  const storedOrder = localStorage.getItem('currentOrder');
  const orderData =
    orderDataRedux || (storedOrder ? JSON.parse(storedOrder) : null);

  // Reset location.state on unmount.
  useEffect(() => {
    return () => {
      location.state = null;
    };
  }, [location]);

  // Fetch addresses using orderData coordinates.
  useEffect(() => {
    const fetchAddress = async (locationCoord, setAddress) => {
      if (locationCoord && locationCoord.lat && locationCoord.lng) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${locationCoord.lat}&lon=${locationCoord.lng}`
          );
          const data = await response.json();
          setAddress(data.display_name || 'Unknown location');
        } catch (error) {
          console.error('Error fetching address:', error);
          setAddress('Error fetching address');
        }
      } else {
        setAddress('Unknown location');
      }
    };

    if (orderData?.userLocation) {
      fetchAddress(orderData.userLocation, setUserLocationAddress);
    }
    if (orderData?.destination) {
      fetchAddress(orderData.destination, setDestinationAddress);
    }
  }, [orderData?.userLocation, orderData?.destination]);

  // If no order data is found, render an error message.
  if (!orderData) {
    return <p>Error: No order data found.</p>;
  }

  // Extract sender's name (defaulting if missing)
  const senderName = orderData.senderName || 'Unknown User';

  // Map vehicle names to images.
  const vehicleImages = {
    pickup: Pickup,
    miniTruck: MiniTruck,
    van: Van,
    'Car Rescue': CarRescue,
    tukTuk: TukTuk,
    SwyftBoda: nduthi,
    Lorry: TenTonne,
    lorry5Tonne: fiveTonne,
    lorry10Tonne: TenTonne,
    car: moti,
    SwyftBodaElectric: nduthiElectric,
    // 'Lorry': TenTonne,
    Tipper: Tipper,
  };
  const vehicleImage = vehicleImages[orderData.vehicle] || Pickup;

  // Calculate distance-only cost.
  const distanceCost = (orderData.totalCost ?? 0) - (orderData.loaderCost ?? 0);

  const handleConfirmOrder = async () => {
    // Validate required fields.
    if (!packageType) {
      setErrorMessage('Please select a package type.');
      return;
    }
    if (selectedPayment === 'receiver' && (!receiverName || !receiverPhone)) {
      setErrorMessage('Please fill in the receiver details.');
      return;
    }
    setErrorMessage('');
    setIsFindingDriver(true);
    setIsLoading(true);
    const token = Cookies.get('authTokencl1');

    const finalOrderData = {
      ...orderData,
      packageType,
      paymentInfo: {},
    };

    if (selectedPayment === 'sender') {
      finalOrderData.paymentInfo = {
        payBy: 'sender',
        description: `To be Sorted by ${senderName}`,
      };
    } else {
      finalOrderData.paymentInfo = {
        payBy: 'receiver',
        name: receiverName,
        phone: receiverPhone,
        description: `To be Sorted by ${receiverName} (Phone: ${receiverPhone})`,
      };
    }

    try {
      const response = await fetch(
        'https://swyft-backend-client-nine.vercel.app/orders',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(finalOrderData),
        }
      );

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(
          errorResult.error || 'Failed to place order, server error'
        );
      }

      const data = await response.json();

      const order_id = data.order.id;
      const driver_id = data.order.driver_id;
      const nearest_driver_car = data.nearest_driver.car_type;
      const nearest_driver_name = data.nearest_driver.first_name;
      const nearest_driver_phone = data.nearest_driver.phone;
      const order_status = data.order.status;
      const license = data.nearest_driver.license_plate;

      // console.log("Order ID: " + order_id);
      // console.log("Driver ID: " + driver_id);
      // console.log("Nearest Driver Car: " + nearest_driver_car);
      // console.log("Nearest Driver Name: " + nearest_driver_name);
      // console.log("Nearest Driver Phone: " + nearest_driver_phone);
      // console.log("Order Status: " + order_status);
      // console.log("License: " + license);

      localStorage.setItem("order_id", order_id);
      localStorage.setItem("driver_id",driver_id);
      localStorage.setItem("car",nearest_driver_car);
      localStorage.setItem("name", nearest_driver_name);
      localStorage.setItem("phone", nearest_driver_phone);
      localStorage.setItem("status", order_status);
      localStorage.setItem("license", license);

      Cookies.remove('NavigateToDriverDetails');
    } catch (error) {
      setIsFindingDriver(false);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

    // console.log(response.order.id);
    // const order_id = response.order.id;
    // console.log(order_id);
    
  
  const packageOptions = [
    'Furniture',
    'Household items',
    'Crates or boxes',
    'Construction Materials',
    'Perishable goods',
    'Container',
    'Medical Supplies',
    'Other',
  ];

  // Render the FindDriver component if in the "Finding Driver" phase.
  if (isFindingDriver) {
    return (
      <FindDriver
        onDriverFound={() => {
          navigate('/driverDetails');
          location.state = null;
        }}
        onDriverNotFound={(message) => {
          setErrorMessage(message);
          setIsFindingDriver(false);
        }}
      />
    );
  }

  return (
    <div className="Top-Container">
      <div className="Sec-container">
        {/* Header */}
        <div className="header">Booking Details</div>

        {/* Vehicle Info */}
        <div className="card vehicle-info">
          <img
            src={vehicleImage}
            alt={orderData.vehicle}
            className="vehicle-icon"
          />
          <div className="vehicle-details">
            <h3>{orderData.vehicle}</h3>
            <div
              className="Journey"
              style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span
                  style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#00d46a',
                    borderRadius: '50%',
                    display: 'inline-block',
                  }}
                ></span>
                {userLocationAddress ? (
                  <p style={{ margin: 0, fontWeight: 'bold', color: '#333' }}>
                    {userLocationAddress.split(' ').slice(0, 7).join(' ')}
                  </p>
                ) : (
                  <CircularProgress size={20} />
                )}
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    width: '2px',
                    height: '15px',
                    backgroundColor: '#ccc',
                  }}
                ></div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span
                  style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#ff9500',
                    borderRadius: '50%',
                    display: 'inline-block',
                  }}
                ></span>
                {destinationAddress ? (
                  <p style={{ margin: 0, fontWeight: 'bold', color: '#333' }}>
                    {destinationAddress.split(' ').slice(0, 6).join(' ')}
                  </p>
                ) : (
                  <CircularProgress size={20} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Charges Card */}
        <div className="charges-card">
          <h3 className="charges-title">{orderData.vehicle}</h3>
          <div className="charge-row">
            <span>Fare ({orderData.distance} Kms)</span>
            <span className="Price">KSh {distanceCost}</span>
          </div>
          {orderData.loaderCost > 0 && (
            <div className="charge-row">
              <span>Loader Cost</span>
              <span className="Price">KSh {orderData.loaderCost}</span>
            </div>
          )}
          <hr />
          <div className="charge-row subtotal">
            <span>Subtotal</span>
            <span className="Price">KSh {orderData.totalCost}</span>
          </div>
        </div>

        {/* Payment Options */}
        <div className="payment-container">
          <h3 className="payment-title">Who is Paying?</h3>
          <div className="option-group">
            <div
              className={`option ${selectedPayment === 'sender' ? 'selected' : ''}`}
              onClick={() => setSelectedPayment('sender')}
            >
              <span>SENDER (Me)</span>
            </div>
            <div
              className={`option ${selectedPayment === 'receiver' ? 'selected' : ''}`}
              onClick={() => setSelectedPayment('receiver')}
            >
              <span>RECEIVER</span>
            </div>
          </div>

          {selectedPayment === 'receiver' && (
            <div style={{ marginTop: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                Receiver Name:
              </label>
              <input
                className="senderInput"
                type="text"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                placeholder="Enter receiver's name"
                style={{
                  width: '80%',
                  padding: '0.5rem',
                  marginBottom: '0.5rem',
                }}
              />

              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                Receiver Phone:
              </label>
              <input
                className="senderInput"
                type="text"
                value={receiverPhone}
                onChange={(e) => setReceiverPhone(e.target.value)}
                placeholder="Enter receiver's phone"
                style={{ width: '80%', padding: '0.5rem' }}
              />
            </div>
          )}
        </div>

        {/* Package Type Input */}
        <div className="package-type-container" style={{ marginTop: '1rem' }}>
          <div
            className="senderInput"
            onClick={() => setShowPackagePopup(true)}
            style={{
              border: '1px solid #ccc',
              padding: '0.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {packageType || 'Select package type'}
          </div>
        </div>

        {/* Package Type Popup */}
        {showPackagePopup && (
          <div
            className="package-popup-overlay"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
            }}
          >
            <div
              className="package-popup"
              style={{
                backgroundColor: '#fff',
                padding: '1rem',
                borderRadius: '4px',
                width: '90%',
                maxWidth: '400px',
              }}
            >
              <h3>Select Package Type</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {packageOptions.map((option) => (
                  <li
                    key={option}
                    onClick={() => {
                      setPackageType(option);
                      setShowPackagePopup(false);
                    }}
                    style={{
                      padding: '0.5rem',
                      borderBottom: '1px solid #ccc',
                      cursor: 'pointer',
                    }}
                  >
                    {option}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setShowPackagePopup(false)}
                style={{
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="buttons" style={{ marginTop: '1rem' }}>
          <button
            onClick={() => {
              navigate('/');
              dispatch(deleteOrder());
            }}
            disabled={isLoading}
            className="button"
            style={{ backgroundColor: 'red' }}
          >
            Cancel
          </button>

          <button
            onClick={handleConfirmOrder}
            disabled={isLoading}
            className="button"
          >
            BOOK NOW
          </button>
        </div>
      </div>

      {/* Error Popup Dialog */}
      <Dialog open={Boolean(errorMessage)} onClose={() => setErrorMessage('')}>
        <DialogTitle>
          <ErrorIcon style={{ marginRight: '8px', color: 'red' }} />
          Error
        </DialogTitle>
        <DialogContent>
          <p>{errorMessage}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorMessage('')} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
