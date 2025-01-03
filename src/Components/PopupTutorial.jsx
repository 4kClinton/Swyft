import React from "react";
import PropTypes from "prop-types";
import "../Styles/PopupTutorial.css"; // Add styles for the popup

const PopupTutorial = ({ message, onDismiss }) => {
  return (
    <div className="popup-tutorial" onClick={onDismiss}>
      {message}
    </div>
  );
};

PopupTutorial.propTypes = {
  message: PropTypes.string.isRequired, // Message to display
  onDismiss: PropTypes.func.isRequired, // Function to call when dismissed
};

export default PopupTutorial;
