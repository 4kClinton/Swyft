// src/Components/Navbar.jsx
import profile from "../assets/profile.jpeg";
import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import { Link, useNavigate } from "react-router-dom"; // Import Link for navigation
import "../Styles/Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Mock user data or retrieve it from localStorage/sessionStorage
  const user = JSON.parse(localStorage.getItem("user")) || null;

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
              onClick={toggleSidebar}
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
                alt="Profile"
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
              <Link onClick={toggleSidebar} to="/login">
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
                onClick={toggleSidebar}
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
                onClick={toggleSidebar}
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
                onClick={toggleSidebar}
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

          {/* Additional Services */}
          <div className="card">
            <h3>Additional Services</h3>
            <ul>
              <li>
                <i
                  className="fas fa-clipboard-check"
                  style={{ color: "#18b700", marginRight: "8px" }}
                ></i>
                Event Setup Package
              </li>
              <li>
                <i
                  className="fas fa-utensils"
                  style={{
                    color: "#18b700",
                    marginRight: "8px",
                    marginBottom: "8px",
                  }}
                ></i>
                Catering Services
              </li>
              <li>
                <i
                  className="fas fa-building"
                  style={{
                    color: "#18b700",
                    marginRight: "8px",
                    marginBottom: "8px",
                  }}
                ></i>
                Find a House
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
