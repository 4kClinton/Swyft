import React, { useState, useEffect, useRef } from "react";
import "../Styles/Dash.css";
import ConfirmationPopup from "./ConfirmationPopup";
import LoaderPopup from "./LoaderPopup";
import {
  FaTruckPickup,
  FaTruck,
  FaTruckMoving,
  FaCheckCircle,
  FaMotorcycle,
} from "react-icons/fa";

const Dash = ({ distance = 0, userLocation, destination }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [calculatedCosts, setCalculatedCosts] = useState({});
  const [includeLoader, setIncludeLoader] = useState(false);
  const [showConfirmDash, setShowConfirmDash] = useState(false);
  const [numLoaders, setNumLoaders] = useState(1);
  const [showLoaderPopup, setShowLoaderPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const dashRef = useRef(null);

  const rates = { motorcycle: 100, pickup: 160, miniTruck: 260, lorry: 310 };

  useEffect(() => {
    const newCalculatedCosts = Object.entries(rates).reduce(
      (acc, [vehicle, rate]) => {
        let calculatedCost = rate * distance;
        if (vehicle !== "motorcycle") {
          calculatedCost = calculatedCost < 700 ? 1000 : calculatedCost;
        }
        acc[vehicle] = (
          calculatedCost + (includeLoader ? 300 * numLoaders : 0)
        ).toFixed(2);
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

  const handleOrder = () => {
    if (!destination) {
      setErrorMessage("Please enter a destination location.");
      setShowLoaderPopup(false);
      return;
    }
    if (selectedOption) {
      setIsOpen(false);
      setShowConfirmDash(true);
    } else {
      setErrorMessage("Please select a vehicle option.");
    }
  };

  const confirmOrder = async () => {
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

      const nearbyDrivers = drivers.filter((driver) => {
        return calculateDistance(userLocation, driver.location) <= 2;
      });

      if (nearbyDrivers.length > 0) {
        await sendOrderToDriver(nearbyDrivers[0].id, orderData);
        alert(`Order details sent to driver ${nearbyDrivers[0].name}.`);
      } else {
        alert("No drivers available within 2km.");
      }

      setShowLoaderPopup(false);
      resetDash();
    } catch (error) {
      setErrorMessage("Failed to place order. Please try again.");
      setShowLoaderPopup(false);
    }
  };

  const calculateDistance = (userLocation, driverLocation) => {
    return Math.random() * 5;
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
  };

  const goBackToDash = () => {
    resetDash(); // Clear all order details
    setShowConfirmDash(false); // Hide the confirmation dash
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
      {!showConfirmDash ? (
        <>
          <h2 className="catch">Which means do you prefer?</h2>
          <div className="dash-content">
            {Object.entries(calculatedCosts).map(([vehicle, cost]) => {
              const Icon = {
                motorcycle: FaMotorcycle,
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
                  {cost}
                </label>
              );
            })}
          </div>

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
          <button className="order-button" onClick={handleOrder}>
            Order
            <FaCheckCircle
              size={14}
              className="check-icon"
              style={{ marginLeft: "5px" }}
            />
          </button>
        </>
      ) : (
        <div className="confirm-dash">
          <h2>Confirm Your Order</h2>
          <p>Vehicle: {selectedOption}</p>
          <p>Loaders: {includeLoader ? numLoaders : 0}</p>
          <p>Loader Cost: Ksh {includeLoader ? numLoaders * 300 : 0}</p>
          <p>Total Cost: Ksh {calculatedCosts[selectedOption]}</p>
          <button className="confirm-button" onClick={confirmOrder}>
            Confirm Order
          </button>
          <button className="back-button" onClick={goBackToDash}>
            Go Back
          </button>
        </div>
      )}
      {showLoaderPopup && <LoaderPopup message="Finding a driver..." />}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default Dash;
