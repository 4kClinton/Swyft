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
import { useDispatch } from "react-redux";
import {addUser} from "./Redux/Reducers/UserSlice";
import FindDriver from "./Components/FindDriver.jsx";
import { Phone } from "@mui/icons-material";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";


function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLightMode, setIsLightMode] = useState(true);
   const dispatch = useDispatch()
 
  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    if (token) {
      fetch("https://swyft-server-t7f5.onrender.com/check_session", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to verify token");
          }
          return response.json()
        })

        .then((userData) => {
          
          console.log(userData);
         
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
