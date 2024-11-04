// LoadingScreen.js
import React from "react";
import "../Styles/LoadingScreen.css"; // Add styles here if needed
import logo from "../assets/screen.png"; // Ensure the path to the logo is correct
import logo2 from "../assets/swyft-logo2.png"; // Add styles here

const LoadingScreen = () => (
  <div className="loading-screen">
    {/*  */}
    <img src={logo} alt="App Logo" className="loading-logo" />
  </div>
);

export default LoadingScreen;
