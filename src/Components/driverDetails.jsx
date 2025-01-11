import React from "react";
import "../Styles/DriverDetails.css"; // Import the CSS file
import profilePic from "../assets/profilePic.jpeg";
import carPic from "../assets/pickup.png";
import Ratings from "../Components/Rating.jsx"; // Import the Ratings component

import { FaPhoneAlt } from "react-icons/fa"; // Importing the phone icon
import { useNavigate } from "react-router-dom"; // Importing useNavigate for navigation

// Sample data for the driver
const driverData = {
  name: "John Kinuthia",
  numberPlate: "XYZ 1234",
  carType: "Toyota Hilux",
  pictureUrl: profilePic, // Corrected image import for profile
  carImageUrl: carPic, // Corrected image import for car
  rating: 4.5, // Added driver rating
  phone: "0796 205 375",
};

const DriverDetails = () => {
  const navigate = useNavigate(); // Hook to navigate

  const handleGoHome = () => {
    navigate("/"); // Navigate to the home page
  };

  return (
    <div className="container">
      <div className="driverInfo">
        <img src={driverData.pictureUrl} alt="Driver" className="driverImage" />
        <div className="textContainer">
          <h2 className="name">{driverData.name}</h2>
          <p className="numberPlate">{driverData.numberPlate}</p>
          <p className="carType">{driverData.carType}</p>
          {/* Add the Ratings component here */}
          <Ratings rating={driverData.rating} />
        </div>
      </div>

      <div className="carImageContainer">
        <img src={driverData.carImageUrl} alt="Car" className="carImage" />
      </div>

      <div className="phoneContainer">
        <a
          href={`tel:${driverData.phone}`}
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
          }}
        >
          <FaPhoneAlt
            className="phoneIcon"
            style={{ marginRight: "20px", color: "#ffff" }}
          />
          <h2 className="phoneNumber" style={{ color: "#ffff" }}>
            {driverData.phone}
          </h2>
        </a>
      </div>

      {/* Go back home button */}
      <button className="goHomeButton" onClick={handleGoHome}>
        Go Back Home
      </button>
    </div>
  );
};

export default DriverDetails;
