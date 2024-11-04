// src/App.jsx

import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import Router and Routes
import Navbar from "./Components/Navbar.jsx";
import Map from "./Components/Map.jsx";
import LoadingScreen from "./Components/LoadingScreen.jsx";
import Login from "./Components/Login.jsx";
import SignUp from "./Components/SignUp.jsx";
import "./App.css";
import { UserProvider } from "./contexts/UserContext.jsx";

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
              {/* You can add more routes here */}
            </Routes>
          </div>
        )}
      </Router>
    </UserProvider>
  );
}

export default App;
