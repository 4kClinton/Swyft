// src/Components/Navbar.jsx
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
import { Link } from "react-router-dom"; // Import Link for navigation
import { useUser } from "../contexts/UserContext"; // Import the useUser hook
import "../Styles/Navbar.css";

const Navbar = ({ toggleTheme, isLightMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser(); // Access user from context

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div className="icon-button" onClick={toggleSidebar}>
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </div>

      <div className={`sidebar ${isOpen ? "show-sidebar" : ""}`}>
        <div className="cards">
          <div className="card">
            <h3>
              <AccountCircleIcon
                style={{ color: "#FFA500", marginRight: "8px" }}
              />
              {user ? `Hi, ${user.name}` : "Account"}{" "}
              {/* Display user's name */}
            </h3>
            {!user && ( // Show login button only if user is not logged in
              <Link to="/login">
                <button className="login-button">Log In</button>
              </Link>
            )}
          </div>

          <div className="card">
            <h3>Account Options</h3>
            <ul>
              <li>
                <PaymentIcon style={{ color: "#FFA500", marginRight: "8px" }} />
                Payment
              </li>
              <li>
                <HistoryIcon style={{ color: "#FFA500", marginRight: "8px" }} />
                Ride History
              </li>
              <li>
                <SettingsIcon
                  style={{ color: "#FFA500", marginRight: "8px" }}
                />
                Settings
              </li>
            </ul>
          </div>

          <div className="card">
            <h3>
              <HelpIcon style={{ color: "#FFA500", marginRight: "8px" }} />
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
