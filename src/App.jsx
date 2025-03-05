import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Components/Navbar.jsx';
import LoadingScreen from './Components/LoadingScreen.jsx';
import './App.css';
import { UserProvider } from './contexts/UserContext.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from './Redux/Reducers/UserSlice';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { supabase } from './supabase.js';
import { deleteOrder, saveOrder } from './Redux/Reducers/CurrentOrderSlice.js';
import {
  removeDriver,
  saveDriver,
} from './Redux/Reducers/DriverDetailsSlice.js';
import { saveOrders } from './Redux/Reducers/ordersHistorySlice.js';
import Cookies from 'js-cookie';

// MUI components for the custom popup
import { Box, Typography, Button } from '@mui/material';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  const dispatch = useDispatch();
  const customer = useSelector((state) => state.user.value);
  const [updateOrders, setUpdateOrders] = useState(false);
  const navigate = useNavigate();

  // ----------------------
  // PWA install logic
  // ----------------------
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPopup, setShowInstallPopup] = useState(false);

  // Capture the beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      console.log('🔥 beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
    };
  }, []);

  // Always show the install popup if not installed and a valid deferredPrompt exists
  useEffect(() => {
    const isStandalone = window.matchMedia(
      '(display-mode: standalone)'
    ).matches;
    if (!isStandalone && deferredPrompt) {
      setShowInstallPopup(true);
    } else {
      setShowInstallPopup(false);
    }
  }, [deferredPrompt]);

  // When the user clicks "Install" in our custom popup
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('User response to the install prompt:', outcome);
      setDeferredPrompt(null);
      setShowInstallPopup(false);
      navigate('/');
    }
  };

  // ----------------------
  // Orders & Session logic
  // ----------------------
  useEffect(() => {
    // Subscribe to changes in the 'orders' table
    let supabaseOrderId;
    const ordersChannel = supabase
      .channel('orders')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload?.new?.customer_id === customer.id) {
            const updatedStatus = payload?.new?.status;
            if (updatedStatus === 'Accepted') {
              handleOrderAccepted(payload);
            } else if (updatedStatus === 'arrived_at_customer') {
              handleArrivedAtCustomer(payload);
            } else if (updatedStatus === 'on_the_way_to_destination') {
              handleOnTheWayToDestination(payload);
            } else if (updatedStatus === 'completed') {
              handleRideCompleted();
            }
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload?.new?.customer_id === customer.id) {
            supabaseOrderId = payload.new.id;
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload?.old?.id === supabaseOrderId) {
            setShowErrorPopup(true);
          }
        }
      )
      .subscribe();

    return () => {
      if (ordersChannel) {
        supabase
          .removeChannel(ordersChannel)
          .then(() => console.log('Channel successfully removed'))
          .catch((error) => console.error('Error removing channel:', error));
      }
    };
  }, [customer.id, dispatch]);

  useEffect(() => {
    const token = Cookies.get('authTokencl1');
    if (token) {
      fetch('https://swyft-backend-client-nine.vercel.app/check_session', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          if (!response.ok) throw new Error('Failed to verify token');
          return response.json();
        })
        .then((userData) => dispatch(addUser(userData)))
        .catch((error) => console.error('Token verification failed:', error));
    }
  }, [dispatch]);

  useEffect(() => {
    const token = Cookies.get('authTokencl1');
    if (token) {
      fetch('https://swyft-backend-client-nine.vercel.app/orders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) throw new Error('Failed to fetch rides history');
          return response.json();
        })
        .then((data) => {
          dispatch(saveOrders(data));
          const currentOrder = data.filter(
            (order) =>
              order.status !== 'completed' &&
              order.status !== 'cancelled' &&
              order.status !== 'Pending' &&
              order.status !== 'Declined'
          );
          dispatch(saveOrder(currentOrder[0]));
          if (currentOrder.length > 0) {
            fetch(
              `https://swyft-backend-client-nine.vercel.app/driver/${currentOrder[0]?.driver_id}`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application',
                  Authorization: `Bearer ${token}`,
                },
              }
            )
              .then((response) => {
                if (!response.ok)
                  throw new Error('Failed to fetch driver data');
                return response.json();
              })
              .then((driverData) => dispatch(saveDriver(driverData)));
          }
        })
        .catch((error) =>
          console.error('Error fetching rides history:', error)
        );
    }
  }, [updateOrders]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleOrderAccepted = (payload) => {
    const token = Cookies.get('authTokencl1');
    fetch(
      `https://swyft-backend-client-nine.vercel.app/driver/${payload.new.driver_id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch driver data');
        return response.json();
      })
      .then((driverData) => {
        dispatch(saveDriver(driverData));
        dispatch(saveOrder(payload.new));
      })
      .catch((error) => console.error('Error fetching driver data:', error));
  };

  const handleArrivedAtCustomer = (payload) => {
    dispatch(saveOrder(payload.new));
    alert('Your driver has arrived at the customer location!');
  };

  const handleOnTheWayToDestination = (payload) => {
    dispatch(saveOrder(payload.new));
    alert('Your driver is on the way to the destination!');
  };

  const handleRideCompleted = () => {
    dispatch(deleteOrder());
    dispatch(removeDriver());
    setUpdateOrders((prev) => !prev);
    Cookies.remove('NavigateToDriverDetails');
    navigate('/rate-driver');
    alert('The ride is completed! Thank you for using our service.');
  };

  const handleCloseErrorPopup = () => {
    dispatch(deleteOrder());
    setShowErrorPopup(false);
    navigate('/dash');
  };

  return (
    <UserProvider>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div>
          <Navbar />
          <Outlet />
          <Analytics />
          <SpeedInsights />
        </div>
      )}

      {/* Error Popup Modal */}
      {showErrorPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <p>No driver found for your order. Please try again later.</p>
            <button onClick={handleCloseErrorPopup}>Close</button>
          </div>
        </div>
      )}

      {/* Custom Popup to show the "Install" button (always visible if not installed) */}
      {showInstallPopup && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
          }}
        >
          <Box
            sx={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              padding: '32px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Montserrat' }}>
              Install Swyft
            </Typography>
            <Typography
              variant="body2"
              sx={{ mb: 2, fontFamily: 'Montserrat' }}
            >
              Get a better experience by installing our app.
            </Typography>
            <Button
              onClick={handleInstallClick}
              sx={{
                backgroundColor: '#00d46a',
                color: '#fff',
                border: 'none',
                textTransform: 'none',
                fontWeight: 'bold',
                padding: '8px 16px',
                '&:hover': { backgroundColor: '#00c059' },
              }}
            >
              Install
            </Button>
          </Box>
        </div>
      )}
    </UserProvider>
  );
}

export default App;
