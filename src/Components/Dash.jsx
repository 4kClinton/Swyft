import React, { useState, useEffect, useRef } from "react";
import "../Styles/Dash.css";
import { useNavigate } from "react-router-dom";
import ConfirmationPopup from "./ConfirmationPopup";
import DateTimePopup from "./DateTimePopup";
import LoaderPopup from "./LoaderPopup";
import ErrorPopup from "./ErrorPopup"; // New ErrorPopup
import SuccessPopup from "./SuccessPopup"; // New SuccessPopup
import CircularProgress from "@mui/material/CircularProgress";
import FindDriverComponent from "./FindDriverComponent";
import PopupTutorial from "../Components/PopupTutorial.jsx";
import {
  FaTruckPickup,
  FaTruck,
  FaTruckMoving,
  FaCarCrash,
  FaCheckCircle,
  FaRegClock,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { saveOrder } from "../Redux/Reducers/CurrentOrderSlice.js";


const Dash = ({ distance = 0, userLocation, destination }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const driver = useSelector((state) => state.driverDetails.value);
  
  const [selectedOption, setSelectedOption] = useState("");
  const [calculatedCosts, setCalculatedCosts] = useState({});
  const [includeLoader, setIncludeLoader] = useState(false);
  const [numLoaders, setNumLoaders] = useState(1);
  const [showDateTimePopup, setShowDateTimePopup] = useState(false);
  const [showLoaderPopup, setShowLoaderPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [scheduleDateTime, setScheduleDateTime] = useState("");
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // New state for success popup
  const [showFindDriverComponent, setFindDriverComponent] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const theUser = useSelector((state) => state.user.value);

  const [isLoading, setIsLoading] = useState(false);

  const [orderConfirmed, setOrderConfirmed] = useState(false); 
  const dispatch = useDispatch();
  
  


   
  useEffect(() => {
    const loginStatus = theUser.name;
  
    if (loginStatus) {
      setIsLoggedIn(true); // User is logged in
    }
  }, [theUser]);

  const dashRef = useRef(null);

  // Rate and distance calculations
  const rates = {
    pickup: 160,
    miniTruck: 230,
    lorry: 310,
    flatbed: 350,
  };

  useEffect(() => {
    const newCalculatedCosts = Object.entries(rates).reduce(
      (acc, [vehicle, rate]) => {
        // Calculate base cost
        let calculatedCost = rate * distance;

        // Apply specific minimum logic for flatbed
        if (vehicle === "flatbed") {
          calculatedCost = Math.max(calculatedCost, 3500);
        }

        // Enforce minimum cost of 1000 for all vehicles
        calculatedCost = Math.max(calculatedCost, 1000);

        // Add loader costs if applicable
        acc[vehicle] = Math.round(
          calculatedCost + (includeLoader ? 300 * numLoaders : 0)
        );

        return acc;
      },
      {}
    );

    setCalculatedCosts(newCalculatedCosts);
  }, [distance, includeLoader, numLoaders]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dashRef.current && !dashRef.current.contains(event.target))
        setIsOpen(false);
    };
    if (isOpen) document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  const toggleDash = () => setIsOpen(!isOpen);
  const handleOptionChange = (vehicle) => setSelectedOption(vehicle);
  const handleLoaderChange = (e) => setIncludeLoader(e.target.checked);
  const handleNumLoadersChange = (e) => {
    const value = parseInt(e.target.value);
    setNumLoaders(isNaN(value) ? 0 : Math.max(0, value));
  };

  const handleSelectDateTime = async () => {
    if (!selectedOption) {
      setErrorMessage("Please select a vehicle first.");
      return;
    }

    // Construct the order data
    const orderData = {
      id: theUser.id, // User ID
      vehicle: selectedOption,
      distance,
      loaders: includeLoader ? numLoaders : 0,
      loaderCost: includeLoader ? numLoaders * 300 : 0,
      totalCost: calculatedCosts[selectedOption],
      userLocation,
      destination,
      time: new Date().toLocaleString(),
    };

    try {
      // Save order data to localStorage
      localStorage.setItem("orderDetails", JSON.stringify(orderData));

      // Log the stored order details for debugging
     
      // Push order data to the backend
      const response = await fetch(
        "https://swyft-backend-client-nine.vercel.app/schedule",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to schedule the order: ${response.statusText}`);
      }

      const responseData = await response.json();
     
      setShowDateTimePopup(true); // Show Date/Time Popup after a successful API call
    } catch (error) {
      console.error("Error scheduling the order:", error.message);
      setErrorMessage("Failed to schedule the order. Please try again later.");
    }
  };

  const handleScheduleOrder = () => {
    if (!scheduleDateTime) {
      setErrorMessage("Please select a date and time for scheduling.");
      return;
    }

    const alertTime = new Date(scheduleDateTime).getTime();
    const currentTime = Date.now();
    const delay = alertTime - currentTime;

    if (delay > 0) {
      setTimeout(() => setShowSuccessPopup(true), delay); // Show success popup
      setShowSuccessPopup(true);
    } else {
      setErrorMessage("Please select a future date and time.");
    }
    setShowDateTimePopup(false); // Close the DateTimePopup after scheduling
  };
  console.log("dest:", destination);
  const confirmOrder = async () => {
    localStorage.removeItem('driverData')
    console.log(driver);
    
    if (!destination.length < 0) {
      setErrorMessage("Please enter a destination location.");
      return;
    }
    if (!selectedOption) {
      setErrorMessage("Please select a vehicle.");
      return;
    }

    // Check if the user is logged in
    function LoggedIn() {
      return isLoggedIn;
    }

    const user = JSON.parse(sessionStorage.getItem("theUser")); // Adjust according to how you store user data
    if (!theUser || !theUser.id || !theUser.name) {
      setErrorMessage("User details are missing. Please log in again.");
      return;
    }

    // Construct the order data including user details
    const orderData = {
      id: theUser.id, // User ID
      vehicle: selectedOption,
      distance,
      loaders: includeLoader ? numLoaders : 0,
      loaderCost: includeLoader ? numLoaders * 300 : 0,
      totalCost: calculatedCosts[selectedOption],
      userLocation,
      destination,
      time: new Date().toLocaleString(),
    };

    setFindDriverComponent(true); // Show driver search component
    setIsLoading(true); // Start loading state

    const token = sessionStorage.getItem("authToken");

    try {
      const response = await fetch(
        "https://swyft-backend-client-nine.vercel.app/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to place order, server error");
      }

      const result = await response.json();
      console.log("Order placed successfully:", result);
      if(driver?.id){
        setShowLoaderPopup(false); // Close loader popup
        setShowSuccessPopup(true); // Show success popup
        resetDash(); 

      }
     // Reset the dashboard after a successful order
    } catch (error) {
      console.error("Error while placing order:", error);
      setErrorMessage("Failed to place order. Please try again."); // Show error message
    } finally {
      setOrderConfirmed(true);
      setIsLoading(false); // End loading state
    }
  };

  const calculateDistance = (userLocation, driverLocation) => {
    const toRadians = (degrees) => (degrees * Math.PI) / 180;

    const R = 6371; // Radius of the Earth in km
    const lat1 = toRadians(userLocation.latitude);
    const lon1 = toRadians(userLocation.longitude);
    const lat2 = toRadians(driverLocation.latitude);
    const lon2 = toRadians(driverLocation.longitude);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in km
  };

  const sendOrderToDriver = async (driverId, orderData) => {
    try {
      const response = await fetch(`http://localhost:3000/vehicles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to place order, server error");
      }

      const result = await response.json();
     
    } catch (error) {
      console.error("Error while sending order:", error);
      setErrorMessage("Failed to place order. Please try again.");
    }
  };

  const resetDash = () => {
    // setSelectedOption("");
    setIncludeLoader(false);
    setNumLoaders(1);
    setCalculatedCosts(0);
    setErrorMessage("");
    setScheduleDateTime("");
  };

  const goBackToDash = () => {
    // resetDash();
    setShowDateTimePopup(false);
    setShowConfirmationPopup(false);
  };

  const handlePopupClose = () => {
    // resetDash();
    setShowLoaderPopup(false);
    setErrorMessage("");
  };

  return (
    <div
      key={distance}
      ref={dashRef}
      className={`Dash ${isOpen ? "open" : ""}`}
    >
      <div className="notch" onClick={toggleDash}>
        <div className="notch-indicator"></div>
      </div>

      {/* Vehicle Selection */}
      {/* <PopupTutorial
        message="Click to Open"
        onDismiss={() => setShowPopup(true)}
      /> */}
      <h2 className="catch" onClick={toggleDash}>
        Which means do you prefer?
      </h2>
      <div className="dash-content">
        {Object.entries(calculatedCosts)
          .filter(([vehicle]) => vehicle !== "flatbed") // Exclude "flatbed" option
          .map(([vehicle, cost]) => {
            const Icon = {
              pickup: FaTruckPickup,
              miniTruck: FaTruck,
              lorry: FaTruckMoving,
            }[vehicle];
            return (
              <label
                key={vehicle}
                className="Option"
                onClick={() => handleOptionChange(vehicle)}
              >
                <div
                  className={`checkbox ${
                    selectedOption === vehicle ? "selected" : ""
                  }`}
                >
                  <Icon size={24} />
                </div>
                {vehicle.charAt(0).toUpperCase() + vehicle.slice(1)} - Ksh{" "}
                {distance > 0 ? cost : "0"}
              </label>
            );
          })}
      </div>

      {/* Loader Option */}
      <div className="loader-option">
        <label>
          <input
            className="round-checkbox"
            type="checkbox"
            checked={includeLoader}
            onChange={handleLoaderChange}
          />
          Need a loader for unloading? (Ksh 300 per loader)
        </label>
        {includeLoader && (
          <input
            className="loader-input"
            type="number"
            value={numLoaders}
            onChange={handleNumLoadersChange}
            style={{ marginLeft: "10px", width: "50px" }}
          />
        )}
      </div>

      <div className="total-cost">
        <h3>Total Cost: Ksh {calculatedCosts[selectedOption] || "0"}</h3>
      </div>

      <div className="order-group">
        {/* Confirm and Schedule */}
        <button
          className="order-button"
          onClick={confirmOrder}
          disabled={isLoading} // Disable the button while loading
          style={{
            opacity: isLoading ? 0.7 : 1,
            width: "40vh",
            backgroundColor: "#00D46A",
          }} // Optional styling for loading state
        >
          {isLoading ? (
            <>
              Placing Order...
              <span className="order-spinner" />
            </>
          ) : (
            <>
              Confirm Order
              <FaCheckCircle
                size={14}
                className="check-icon"
                style={{ marginLeft: "5px", width: "2vh" }}
              />
            </>
          )}
        </button>

        {/* Schedule Button with FaRegClock */}
        {/* <button className="order-button" onClick={handleSelectDateTime}>
    Schedule Move
    <FaRegClock
      size={14}
      className="check-icon"
      style={{ marginLeft: "5px" }}
    />
  </button> */}

        {/* Popups */}
        {errorMessage && (
          <ErrorPopup message={errorMessage} onClose={handlePopupClose} />
        )}
        {showConfirmationPopup && <ConfirmationPopup onClose={goBackToDash} />}
        {showSuccessPopup && <SuccessPopup onClose={goBackToDash} />}
        {showDateTimePopup && (
          <DateTimePopup
            scheduleDateTime={scheduleDateTime}
            setScheduleDateTime={setScheduleDateTime}
            onClose={() => setShowDateTimePopup(false)}
          />
        )}
        {showLoaderPopup && <LoaderPopup />}
      </div>
    </div>
  );
};

export default Dash;
