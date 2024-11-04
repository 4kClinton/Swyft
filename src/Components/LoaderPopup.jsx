// LoaderPopup.js
import React from "react";

const LoaderPopup = ({ message }) => {
  return (
    <div className="loader-popup">
      <h2>{message}</h2>
    </div>
  );
};

export default LoaderPopup;
