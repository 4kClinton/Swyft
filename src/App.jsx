import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import Router and Routes
import Navbar from "./Components/Navbar.jsx";
import Map from "./Components/Map.jsx";
import LoadingScreen from "./Components/LoadingScreen.jsx";
import Login from "./Components/Login.jsx";
import SignUp from "./Components/SignUp.jsx";
import ScheduledRides from "./Components/ScheduledRides.jsx";
import "./App.css";
import TripTracker from "./Components/TripTracker.jsx";
import PrivateRoute from "./Components/PrivateRoute.jsx";
import { UserProvider } from "./contexts/UserContext.jsx";
import Account from "./Components/Account.jsx";
import FindHouse from "./Components/FindHouse.jsx";
import RidesHistory from "./Components/MyRides.jsx";
import DriverDetails from "./Components/driverDetails.jsx";
import Settings from "./Components/Settings.jsx";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "./Redux/Reducers/UserSlice";
import FindDriver from "./Components/FindDriver.jsx";
import { Phone } from "@mui/icons-material";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { supabase } from "./supabase.js";
import { deleteOrder } from "./Redux/Reducers/CurrentOrderSlice.js";


function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLightMode, setIsLightMode] = useState(true);
  const dispatch = useDispatch();
  const customer = useSelector((state) => state.user.value);
  const currentOrder = useSelector((state) => state.currentOrder.value);


  useEffect(() => {
    // Subscribe to changes in the 'orders' table
    let supabaseOrderId;
    const token = sessionStorage.getItem("authToken");
    const ordersChannel = supabase
      .channel('orders')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, (payload) => {
      
        if (payload?.new?.customer_id === customer.id && payload?.new?.status === 'Accepted') {
          fetch(`https://swyft-backend-client-nine.vercel.app/driver/${payload.new.driver_id}`,{
            method: 'GET',
            headers: {
              'Content-Type': 'application',
              Authorization : `Bearer ${token}`
          }}).
          then((response) => {
            if (!response.ok) {
              throw new Error("Failed to fetch driver data");
            }
            return response.json();
          }).then((driverData) => { 
            console.log(driverData,payload.new)
          }
          )



          console.log('Order accepted:', payload.new);     
        } 
      })
      //Save the supabase order id to delete the order if no driver is found
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, (payload) => {
        if (payload?.new?.customer_id === customer.id ) {
          supabaseOrderId = payload.new.id; 
        } 
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'orders' }, (payload) => {
        if (payload?.old?.id === supabaseOrderId) {
          console.log('No driver found:', payload.old);
          dispatch(deleteOrder());
        }
     
      })
      .subscribe();

    // Cleanup the subscription on component unmount
    return () => {
      if (ordersChannel) {
        supabase.removeChannel(ordersChannel)
          .then(() => console.log('Channel successfully removed'))
          .catch((error) => console.error('Error removing channel:', error));
      }
    };
  }, [customer.id, dispatch]);

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    if (token) {
      fetch("https://swyft-backend-client-nine.vercel.app/check_session", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to verify token");
          }
          return response.json();
        })

        .then((userData) => {
      

          dispatch(addUser(userData));
        })
        .catch((error) => {
          console.error("Token verification failed:", error);
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
        <Router>
          {isLoading ? (
            <LoadingScreen />
          ) : (
            <div>
              <Navbar />
              <Routes>
                <Route path="/" element={<Map />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/scheduled-rides" element={<ScheduledRides />} />
                <Route path="/acc" element={<Account />} />
                <Route path="/ridesHistory" element={<RidesHistory />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/driverDetails" element={<DriverDetails />} />
                <Route path="/track" element={<TripTracker />} />
                <Route path="/findhouse" element={<FindHouse />} />
                {/* You can add more routes here */}
              </Routes>
              <Analytics />
              <SpeedInsights />
            </div>
          )}
        </Router>
      </UserProvider>
  
  );
}

export default App;
