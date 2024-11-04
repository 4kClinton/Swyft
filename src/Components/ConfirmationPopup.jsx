// ConfirmationPopup.js
import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import "../Styles/ConfirmationPopup.css"; // Ensure you create this CSS file

const ConfirmationPopup = ({ message, onClose, closePopup }) => {
  return (
    <div className="confirmation-popup">
      <FaCheckCircle className="check-icon" size={50} />
      <h3>{message} {" "} </h3>
      <button onClick={closePopup || onClose}>Close</button>
    </div>
  );
};

export default ConfirmationPopup;
