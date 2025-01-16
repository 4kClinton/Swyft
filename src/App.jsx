import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
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
import { saveDriver } from './Redux/Reducers/DriverDetailsSlice.js';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const customer = useSelector((state) => state.user.value);
  const currentOrder = useSelector((state) => state.currentOrder.value);

  useEffect(() => {
    // Subscribe to changes in the 'orders' table
    let supabaseOrderId;
    const token = sessionStorage.getItem('authToken');
    const ordersChannel = supabase
      .channel('orders')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        (payload) => {
          if (
            payload?.new?.customer_id === customer.id &&
            payload?.new?.status === 'Accepted'
          ) {
            fetch(
              `https://swyft-backend-client-nine.vercel.app/driver/${payload.new.driver_id}`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application',
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
                localStorage.setItem('driverData', JSON.stringify(driverData));
                localStorage.setItem('orderData', JSON.stringify(currentOrder));
              });

            console.log('Order accepted:', payload.new);
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
            console.log('No driver found:', payload.old);
            dispatch(deleteOrder());
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

          dispatch(saveDriver(JSON.parse(storedDriverData)));
          dispatch(saveOrder(JSON.parse(storedOrderData)));
        })
        .catch((error) => {
          console.error('Token verification failed:', error);
        });
    }
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

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
    </UserProvider>
  );
}

export default App;
