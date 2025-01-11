import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ScheduledRides() {
  const location = useLocation();
  const navigate = useNavigate();
  const [scheduledRides, setScheduledRides] = useState([]);

  // Placeholder for order data
  const orderData = location.state?.orderData || {};

  useEffect(() => {
    const scheduleRide = async () => {
      try {
        console.log("Attempting to schedule a ride...");
        const response = await fetch(
          "https://swyft-backend-client-ac1s.onrender.com/schedule",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to place order:", errorData);
          throw new Error("Server error: " + response.statusText);
        }

        const responseData = await response.json();
        console.log("Ride scheduled successfully:", responseData);

        // Assuming the response contains updated rides
        setScheduledRides(responseData.rides || []);
      } catch (error) {
        console.error("Error scheduling ride:", error.message);
      }
    };

    if (Object.keys(orderData).length > 0) {
      scheduleRide();
    }
  }, [orderData]);

  // Log location state to debug data flow
  console.log("Location state:", location.state);

  const handleGoBack = () => {
    console.log("Navigating back to home...");
    navigate("/");
  };

  const handleBookNow = (rideId) => {
    console.log(`Booking ride with ID: ${rideId}`);
    alert(`Booking ride with ID: ${rideId}`);
  };

  // Inline styles
  const containerStyle = {
    padding: "20px",
    textAlign: "center",
  };

  const headingStyle = {
    fontSize: "2em",
    marginBottom: "20px",
  };

  const listStyle = {
    color: "white",
    listStyleType: "none",
    padding: "0",
    margin: "0",
  };

  const listItemStyle = {
    backgroundColor: "var(--card-background)",
    margin: "10px 0",
    padding: "15px",
    borderRadius: "var(--border-radius)",
    boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.1)",
    color: "var(--text-color)",
  };

  const rideInfoStyle = {
    color: "white",
    marginBottom: "10px",
    fontSize: "0.9em",
  };

  const bookNowButtonStyle = {
    padding: "8px 16px",
    fontSize: "0.85em",
    backgroundColor: "var(--secondary-color)",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  };

  const bookNowButtonHoverStyle = {
    backgroundColor: "#00B257", // Slightly darker green
  };

  const goBackButtonStyle = {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "1em",
    backgroundColor: "#212121",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  };

  const goBackButtonHoverStyle = {
    backgroundColor: "#2563eb",
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Scheduled Rides</h2>
      <ul style={listStyle}>
        {scheduledRides.length > 0 ? (
          scheduledRides.map((ride) => (
            <li key={ride.id} style={listItemStyle}>
              <p style={rideInfoStyle}>
                <strong>Date:</strong> {ride.date || "N/A"}
              </p>
              <p style={rideInfoStyle}>
                <strong>Time:</strong> {ride.time || "N/A"}
              </p>
              <p style={rideInfoStyle}>
                <strong>From:</strong> {ride.fromLocation || "N/A"}
              </p>
              <p style={rideInfoStyle}>
                <strong>To:</strong> {ride.toLocation || "N/A"}
              </p>
              <button
                style={bookNowButtonStyle}
                onMouseOver={(e) =>
                  Object.assign(e.currentTarget.style, bookNowButtonHoverStyle)
                }
                onMouseOut={(e) =>
                  Object.assign(e.currentTarget.style, bookNowButtonStyle)
                }
                onClick={() => handleBookNow(ride.id)}
              >
                Book Now
              </button>
            </li>
          ))
        ) : (
          <p style={{ color: "black" }}>No scheduled rides available.</p>
        )}
      </ul>
      <button
        style={goBackButtonStyle}
        onMouseOver={(e) =>
          Object.assign(e.currentTarget.style, goBackButtonHoverStyle)
        }
        onMouseOut={(e) =>
          Object.assign(e.currentTarget.style, goBackButtonStyle)
        }
        onClick={handleGoBack}
      >
        Go Back
      </button>
    </div>
  );
}

export default ScheduledRides;
