import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import "../Styles/Navbar.css";

const Navbar = ({ toggleTheme, isLightMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div className="icon-button" onClick={toggleSidebar}>
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </div>

      <div className={`sidebar ${isOpen ? "show-sidebar" : ""}`}>
        <ul>
          <li>Home</li>
          <li>About</li>
          <li>Services</li>
          <li>Contact</li>
        </ul>
      </div>

      {/* <button className="theme-toggle" onClick={toggleTheme}>
        {isLightMode ? <DarkModeIcon /> : <LightModeIcon />}
      </button> */}
    </div>
  );
};

export default Navbar;
