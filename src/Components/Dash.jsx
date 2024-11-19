import React, { useState, useEffect, useRef } from "react";
import "../Styles/Dash.css";
import ConfirmationPopup from "./ConfirmationPopup";
import DateTimePopup from "./DateTimePopup";
import LoaderPopup from "./LoaderPopup";
import ErrorPopup from "./ErrorPopup"; // New ErrorPopup
import SuccessPopup from "./SuccessPopup"; // New SuccessPopup
import CircularProgress from "@mui/material/CircularProgress"; 
import {
  FaTruckPickup,
  FaTruck,
  FaTruckMoving,
  FaCarCrash,
  FaCheckCircle,
  FaRegClock,
} from "react-icons/fa";

const Dash = ({ distance = 0, userLocation, destination }) => {
  const [isOpen, setIsOpen] = useState(false);
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

  const dashRef = useRef(null);

  // Rate and distance calculations
  const rates = {
    pickup: 160,
    miniTruck: 230,
    lorry: 310,
    flatbed: 500,
  };

  useEffect(() => {
    const newCalculatedCosts = Object.entries(rates).reduce(
      (acc, [vehicle, rate]) => {
        let calculatedCost;
        if (vehicle === "flatbed") {
          calculatedCost = Math.max(rate * distance, 5500);
        } else {
          calculatedCost = rate * distance;
          calculatedCost = calculatedCost < 700 ? 1000 : calculatedCost;
        }
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

  const handleSelectDateTime = () => {
    if (!selectedOption) {
      setErrorMessage("Please select a vehicle first.");
      return;
    }
    setShowDateTimePopup(true); // Show Date/Time Popup after selecting vehicle
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

const confirmOrder = async () => {
  if (!destination) {
    setErrorMessage("Please enter a destination location.");
    return;
  }
  if (!selectedOption) {
    setErrorMessage("Please select a vehicle.");
    return;
  }

  const orderData = {
    vehicle: selectedOption,
    distance,
    loaders: includeLoader ? numLoaders : 0,
    loaderCost: includeLoader ? numLoaders * 300 : 0,
    totalCost: calculatedCosts[selectedOption],
    userLocation,
    destination,
    time: new Date().toLocaleString(),
  };

  setShowLoaderPopup(true);

  try {
    const response = await fetch("http://localhost:3001/drivers");
    const drivers = await response.json();

    // Ensure driver locations have latitude and longitude
    const nearbyDrivers = drivers.filter((driver) => {
      if (
        driver.location &&
        driver.location.latitude &&
        driver.location.longitude
      ) {
        return calculateDistance(userLocation, driver.location) <= 2;
      }
      return false;
    });

    if (nearbyDrivers.length > 0) {
      await sendOrderToDriver(nearbyDrivers[0].id, orderData);
      setShowSuccessPopup(true); // Show success popup on successful order
    } else {
      setErrorMessage("No drivers available within 2km.");
    }

    setShowLoaderPopup(false);
    resetDash();
  } catch (error) {
    setErrorMessage("Failed to place order. Please try again.");
    setShowLoaderPopup(false);
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
    await fetch(`http://localhost:3000/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
  };

  const resetDash = () => {
    setSelectedOption("");
    setIncludeLoader(false);
    setNumLoaders(1);
    setCalculatedCosts({});
    setErrorMessage("");
    setScheduleDateTime("");
  };

  const goBackToDash = () => {
    resetDash();
    setShowDateTimePopup(false);
    setShowConfirmationPopup(false);
  };

  const handlePopupClose = () => {
    resetDash();
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
      <h2 className="catch" onClick={toggleDash}>
        Which means do you prefer?
      </h2>
      <div className="dash-content">
        {Object.entries(calculatedCosts).map(([vehicle, cost]) => {
          const Icon = {
            pickup: FaTruckPickup,
            miniTruck: FaTruck,
            lorry: FaTruckMoving,
            flatbed: FaCarCrash,
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
              {vehicle === "flatbed"
                ? "Car Rescue (Flatbed)"
                : vehicle.charAt(0).toUpperCase() + vehicle.slice(1)}{" "}
              - Ksh {cost}
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
        <h3>Total Cost: Ksh {calculatedCosts[selectedOption] || "1000"}</h3>
      </div>

      <div className="order-group">
        {/* Confirm and Schedule */}
        <button className="order-button" onClick={confirmOrder}>
          Confirm Order
          <FaCheckCircle
            size={14}
            className="check-icon"
            style={{ marginLeft: "5px" }}
          />
        </button>

        {/* Schedule Button with FaRegClock */}
        <button className="order-button" onClick={handleSelectDateTime}>
          Schedule Ride
          <FaRegClock
            size={14}
            className="check-icon"
            style={{ marginLeft: "5px" }}
          />
        </button>
        
      </div>

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

  );
};

export default Dash;
