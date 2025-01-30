// LoaderPopup.js
import React from "react";
import "../Styles/findDriver.css"; // Assuming styles for your loader
import CircularProgress from "@mui/material/CircularProgress";

const LoaderPopup = ({ message }) => {
  return (
    <div className="loading-container">
      <div className="popup-loading">
         <h2 >{message}</h2>
         
      </div>
     
    </div>
  );
};

export default LoaderPopup;
