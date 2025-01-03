import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import "../Styles/Calendar.css"

function DateTimePopup({ onClose }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Add blur effect and disable scrolling
    document.body.classList.add("blurred");
    document.body.style.overflow = "hidden";

    return () => {
      // Remove blur effect and re-enable scrolling
      document.body.classList.remove("blurred");
      document.body.style.overflow = "";
    };
  }, []);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  const handleConfirmSelection = () => {
    setShowConfirmation(true);
  };

  const handleFinalConfirm = () => {
    navigate("/scheduled-rides", {
      state: { date: selectedDate, time: selectedTime },
    });
    // Save order data to localStorage
    localStorage.setItem("orderDetails", JSON.stringify(orderData));

    // Log the stored order details for debugging
    console.log("Order details stored locally:", orderData);
    onClose();
  };

  // Popup Content
  const popupContent = (
    <div style={styles.overlay}>
      <div className="Calendar" style={styles.popup}>
        <h3 className="Header">Select Date and Time</h3>

        {!showConfirmation ? (
          <>
            <input
              className="dateAndTimesPicker"
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              // style={styles.input}
            />
            <input
              className="dateAndTimesPicker"
              type="time"
              value={selectedTime}
              onChange={handleTimeChange}
              // style={styles.input}
            />
            <button
              onClick={handleConfirmSelection}
              className="ConfirmDate"
              disabled={!selectedDate || !selectedTime}
            >
              Confirm Date & Time
            </button>
            <button onClick={onClose} className="CalendarCloseButton">
              Close
            </button>
          </>
        ) : (
          <div style={styles.confirmation}>
            <h4 style={styles.confirmHeading}>Confirm Your Selection</h4>
            <p style={styles.text}>Date: {selectedDate}</p>
            <p style={styles.text}>Time: {selectedTime}</p>

            <button onClick={handleFinalConfirm} style={styles.button}>
              Confirm
            </button>
            <button
              onClick={() => setShowConfirmation(false)}
              style={styles.backButton}
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return ReactDOM.createPortal(popupContent, document.body);
}

export default DateTimePopup;

const styles = {
  overlay: {
    position: "fixed", // Makes the overlay fixed on screen
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Semi-transparent overlay
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10000, // Ensure overlay is on top of other elements
  },
  popup: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    width: "60%",
    maxWidth: "400px",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    zIndex: 10002, // Ensure the popup content is on top of overlay
    position: "relative",
    fontFamily: "Montserat",
  },
  heading: {
    fontSize: "1.5em",
    color: "#333",
    marginBottom: "20px",
    fontFamily: "Montserat",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    fontSize: "1em",
    borderRadius: "4px",
    border: "1px solid #ccc",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "12px",
    marginTop: "15px",
    fontSize: "1em",
    color: "#fff",
    backgroundColor: "#00D46A",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontFamily: "Montserat",
  },
  closeButton: {
    marginTop: "10px",
    width: "100%",
    padding: "10px",
    fontSize: "0.9em",
    backgroundColor: "#BA274A",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontFamily: "Montserat",
  },
  confirmation: {
    textAlign: "center",
    fontFamily: "Montserat",
  },
  confirmHeading: {
    fontSize: "1.2em",
    color: "#333",
    marginBottom: "10px",
    fontFamily: "Montserat",
  },
  text: {
    fontSize: "1em",
    color: "#666",
    margin: "5px 0",
    fontFamily: "Montserat",
  },
  backButton: {
    marginTop: "10px",
    width: "100%",
    padding: "10px",
    fontSize: "0.9em",
    backgroundColor: "#841C26",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontFamily: "Montserat",
  },
};
