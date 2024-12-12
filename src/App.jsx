import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import Router and Routes
import Navbar from "./Components/Navbar.jsx";
import Map from "./Components/Map.jsx";
import LoadingScreen from "./Components/LoadingScreen.jsx";
import Login from "./Components/Login.jsx";
import SignUp from "./Components/SignUp.jsx";
import ScheduledRides from "./Components/ScheduledRides.jsx";
import "./App.css";
import Account from "./Components/Account.jsx";
import RidesHistory from "./Components/MyRides.jsx";
import DriverDetails from "./Components/driverDetails.jsx";
import Settings from "./Components/Settings.jsx";
import FindDriver from "./Components/FindDriver.jsx";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLightMode, setIsLightMode] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
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
            {/* You can add more routes here */}
          </Routes>
        </div>
      )}
    </Router>
  );
}

export default App;
