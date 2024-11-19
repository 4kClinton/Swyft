import React from "react";
import "../Styles/Popup.css";

const SuccessPopup = ({ onClose }) => {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup">
        <h2>Success</h2>
        <p>Your order has been placed successfully!</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default SuccessPopup;

const styles = {
  overlay: {
    position: "fixed", // Keeps the overlay fixed on screen
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Semi-transparent background
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 11000, // Ensure it's on top of other elements, but not above the popup
  },
  popup: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    width: "60%", // Adjust width as needed
    maxWidth: "400px",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Adds a subtle shadow
    textAlign: "center",
    position: "relative", // Ensures popup remains relative to the overlay
    zIndex: 12000, // Popup content should be above the overlay
  },
  heading: {
    fontSize: "1.5em",
    color: "#333",
    marginBottom: "20px",
  },
  text: {
    fontSize: "1em",
    color: "#666",
    margin: "5px 0",
  },
  button: {
    width: "100%",
    padding: "12px",
    marginTop: "15px",
    fontSize: "1em",
    color: "#fff",
    backgroundColor: "#18b700", // Green for success
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  closeButton: {
    marginTop: "10px",
    width: "100%",
    padding: "10px",
    fontSize: "0.9em",
    backgroundColor: "#BA274A", // Red for close
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  confirmation: {
    textAlign: "center",
  },
  confirmHeading: {
    fontSize: "1.2em",
    color: "#333",
    marginBottom: "10px",
  },
  backButton: {
    marginTop: "10px",
    width: "100%",
    padding: "10px",
    fontSize: "0.9em",
    backgroundColor: "#841C26", // Dark red for back button
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
