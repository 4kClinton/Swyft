import React from "react";
import "../Styles/findDriver.css"; // Assuming styles for your loader

const FindDriver = () => {
  return (
    <div className="loading-container">
      <div className="spinner">
        <div className="dot dot1"></div>
        <div className="dot dot2"></div>
        <div className="dot dot3"></div>
        <h2>Finding a Driver...</h2>
        <p>Please wait while we locate the best driver for your order.</p>
      </div>
      <p className="loading-text">Finding You a Driver!</p>
    </div>
  );
};

export default FindDriver;
