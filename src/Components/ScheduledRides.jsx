import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ScheduledRides() {
  const location = useLocation();
  const navigate = useNavigate();

  const scheduledRides = location.state?.rides || [
    {
      id: 1,
      date: "2024-11-12",
      time: "10:00 AM",
      fromLocation: "Location A",
      toLocation: "Location B",
    },
    {
      id: 2,
      date: "2024-11-13",
      time: "2:30 PM",
      fromLocation: "Location C",
      toLocation: "Location D",
    },
  ];

  const handleGoBack = () => {
    navigate("/");
  };

  const handleBookNow = (rideId) => {
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
        {scheduledRides.map((ride) => (
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
        ))}
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
