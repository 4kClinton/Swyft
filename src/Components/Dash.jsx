import React, { useState, useEffect } from "react";
import "../Styles/Dash.css";
import {
  FaTruckPickup,
  FaShuttleVan,
  FaTruck,
  FaTruckMoving,
  FaCheckCircle,
} from "react-icons/fa";

const Dash = ({ distance = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [calculatedCosts, setCalculatedCosts] = useState({});

  // Define rates for each vehicle type
  const rates = {
    pickup: 150,
    van: 200,
    miniTruck: 250,
    lorry: 300,
  };
  
  let newCalculatedCosts = {}

  // Update calculated costs whenever the distance changes
  useEffect(() => {
     newCalculatedCosts = Object.entries(rates).reduce(
      (acc, [vehicle, rate]) => {
        acc[vehicle] = (rate * distance).toFixed(2);
        return acc;
      },
      {}
    );
    setCalculatedCosts(newCalculatedCosts);
  }, [distance]);
console.log(distance);
  const toggleDash = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionChange = (vehicle) => {
    setSelectedOption(vehicle);
  };

  return (
    <div key={distance} className={`Dash ${isOpen ? "open" : ""}`}>
      <div className="notch" onClick={toggleDash}>
        <div className="notch-indicator"></div>
      </div>

      <h2 className="catch">Which means do you prefer?</h2>

      <div className="dash-content">
        {/* Display current distance in input */}
        <input
          type="text"
          placeholder="Distance"
          value={distance}
          readOnly
        />

        {/* Render options with updated calculated costs */}
        {Object.entries(calculatedCosts).map(([vehicle, cost]) => {
          const Icon = {
            pickup: FaTruckPickup,
            van: FaShuttleVan,
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
              {vehicle.charAt(0).toUpperCase() + vehicle.slice(1)} - Ksh {cost}
            </label>
          );
        })}
      </div>

      <div className="total-cost">
        <h3>Total Cost: Ksh {calculatedCosts[selectedOption] || "0.00"}</h3>
      </div>

      <div>
        <button className="order-button">
          Order
          <FaCheckCircle
            size={14}
            className="check-icon"
            style={{ marginLeft: "5px" }}
          />
        </button>
      </div>
    </div>
  );
};

export default Dash;
