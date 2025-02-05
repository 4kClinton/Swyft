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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const customer = useSelector((state) => state.user.value);

  const navigate = useNavigate();

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
      //Save the supabase order id to delete the order if no driver is found
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
            toast.error(
              'No driver found for your order. Please try again later.',
              {
                position: 'bottom-center',
                autoClose: 5000,
                onClose: () => {
                  dispatch(deleteOrder());
                },
              }
            );
          }
        }
      )
      .subscribe();

    // Cleanup the subscription on component unmount
    return () => {
      if (ordersChannel) {
        supabase
          .removeChannel(ordersChannel)
          .then(() => console.log('Channel successfully removed'))
          .catch((error) => console.error('Error removing channel:', error));
      }
    };
    //eslint-disable-next-line
  }, [customer.id, dispatch]);

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      fetch('https://swyft-backend-client-nine.vercel.app/check_session', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to verify token');
          }
          return response.json();
        })

        .then((userData) => {
          dispatch(addUser(userData));
          const storedDriverData = localStorage.getItem('driverData');
          const storedOrderData = localStorage.getItem('orderData');

          const orderData = JSON.parse(storedOrderData);

          if (
            orderData?.status !== 'completed' ||
            orderData?.status !== 'cancelled'
          ) {
            dispatch(saveDriver(JSON.parse(storedDriverData)));
            dispatch(saveOrder(orderData));
          } else {
            localStorage.removeItem('driverData');
            localStorage.removeItem('orderData');
          }
        })

        .catch((error) => {
          console.error('Token verification failed:', error);
        });
    }
  }, [dispatch]);

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      fetch('https://swyft-backend-client-nine.vercel.app/orders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch rides history');
          }
          return response.json();
        })
        .then((data) => {
          dispatch(saveOrders(data));
        })
        .catch((error) => {
          console.error('Error fetching rides history:', error);
        });
    }
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleOrderAccepted = async (payload) => {
    const token = sessionStorage.getItem('authToken');
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
        if (!response.ok) {
          throw new Error('Failed to fetch driver data');
        }
        return response.json();
      })
      .then((driverData) => {
        dispatch(saveDriver(driverData));
        dispatch(saveOrder(payload.new));
        localStorage.setItem('driverData', JSON.stringify(driverData));
        localStorage.setItem('orderData', JSON.stringify(payload.new));
        // Show customer an alert or update UI
      })
      .catch((error) => {
        console.error('Error fetching driver data:', error);
      });
  };

  const handleArrivedAtCustomer = (payload) => {
    dispatch(saveOrder(payload.new)); // Update Redux state with new order data

    alert('Your driver has arrived at the customer location!');
  };

  const handleOnTheWayToDestination = (payload) => {
    dispatch(saveOrder(payload.new)); // Update Redux state with new order data

    alert('Your driver is on the way to the destination!');
  };

  const handleRideCompleted = () => {
    dispatch(deleteOrder());
    dispatch(removeDriver());
    localStorage.removeItem('NavigateToDriverDetails');

    // Navigate to the Rating Page after ride completion
    navigate('/rate-driver');

    alert('The ride is completed! Thank you for using our service.');
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
      <ToastContainer />
    </UserProvider>
  );
}

export default App;
