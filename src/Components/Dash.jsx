import React, { useState } from "react";
import "../Styles/Dash.css";
import SearchBar from "../Components/SearchBar.jsx";
import {
  FaTruckPickup,
  FaShuttleVan,
  FaTruck,
  FaTruckMoving,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa"; // Import icons from react-icons

const Dash = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const toggleDash = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionChange = (value) => {
    // Set the selected option; if the same option is clicked again, it will deselect it
    setSelectedOption((prev) => (prev === value ? "" : value));
  };

  const renderOption = (value, label, Icon) => (
    <label className="Option" onClick={() => handleOptionChange(value)}>
      <div className={`checkbox ${selectedOption === value ? "selected" : ""}`}>
        <Icon size={24} />
      </div>
      {label}
    </label>
  );

  return (
    <div className={`Dash ${isOpen ? "open" : ""}`}>
      {/* Notch to pull up */}
      <div className="notch" onClick={toggleDash}>
        <div className="notch-indicator"></div>
      </div>
      {/* Dash content */}
      <h2 className="catch">Which means do you prefer?</h2>
      <div className="dash-content">
        {renderOption("pickup", "Pick up", FaTruckPickup)}{" "}
        {/* Pickup Truck Icon */}
        {renderOption("seagull", "Van", FaShuttleVan)} {/* Van Icon */}
        {renderOption("miniTruck", "Mini Truck", FaTruck)}{" "}
        {/* Mini Truck Icon */}
        {renderOption("truck", "Lorry", FaTruckMoving)} {/* Truck Icon */}
      </div>
      <div>
        <button className="order-button">
          {" "}
         
          Order
          <FaCheckCircle size={14} className="check-icon" style={{
            marginLeft: "5px",
           
          }} />
        </button>
      </div>
    </div>
  );
};

export default Dash;
