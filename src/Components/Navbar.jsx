// src/Components/Navbar.jsx
import profile from "../assets/profile.jpeg";
import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import PaymentIcon from "@mui/icons-material/Payment";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link, useNavigate } from "react-router-dom"; // Import Link for navigation
import { useUser } from "../contexts/UserContext"; // Import the useUser hook
import "../Styles/Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser(); // Access user from context
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/"); // Navigate to the home page
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Sidebar toggle button */}
      <div className="icon-button" onClick={toggleSidebar}>
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </div>

      {/* Sidebar container */}
      <div className={`sidebar ${isOpen ? "show-sidebar" : ""}`}>
        <div className="cards">
          {/* Account Info */}
          <div className="card">
            <Link
              to="/acc"
              style={{
                backgroundColor: "var(--primary-color)",
                padding: "1vh",
                borderRadius: "10px",
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                alignItems: "center",
                marginBottom: "2vh",
              }}
            >
              <img
                src={profile}
                alt="null"
                style={{
                  width: "5vh",
                  borderRadius: "50%",
                  marginRight: "8px",
                }}
              />
              <h3>{user ? `Hi, ${user.name}` : "Account"}</h3>
            </Link>

            {/* Login Button */}
            {!user && (
              <Link to="/login">
                <button className="login-button">Log In</button>
              </Link>
            )}
          </div>

          {/* Account Options */}
          <div className="card">
            <h3>Account Options</h3>
            <ul className="menu-options">
              {/* Ride History */}
              <Link
                to="/ridesHistory"
                style={{
                  backgroundColor: "var(--primary-color)",
                  padding: "10px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <HistoryIcon style={{ color: "#18b700", marginRight: "8px" }} />
                Ride History
              </Link>

              {/* Scheduled Rides */}
              <Link
                to="/scheduled-rides"
                style={{
                  backgroundColor: "var(--primary-color)",
                  padding: "10px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <HistoryIcon style={{ color: "#18b700", marginRight: "8px" }} />
                Scheduled Rides
              </Link>

              {/* Settings */}
              <Link
                to="/settings"
                style={{
                  backgroundColor: "var(--primary-color)",
                  padding: "10px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <SettingsIcon
                  style={{ color: "#18b700", marginRight: "8px" }}
                />
                Settings
              </Link>
            </ul>
          </div>

          {/* Help Section */}
          <div className="card">
            <h3>
              <HelpIcon
                style={{ color: "#18b700", marginRight: "8px", margin: "0" }}
              />
              Help
            </h3>
            <p>If you need assistance, please contact us!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
