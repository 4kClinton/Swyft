import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ScheduledRides() {
  const location = useLocation();
  const navigate = useNavigate();

  // Mock data or data passed via location.state (make sure to pass an array of rides)
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
    // Add more mock rides if necessary
  ];

  const handleGoBack = () => {
    navigate("/"); // Navigate to the home page
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Scheduled Rides</h2>

      <div style={styles.cardContainer}>
        {scheduledRides.map((ride) => (
          <div key={ride.id} style={styles.card}>
            <p style={styles.text}>
              <strong>Date:</strong> {ride.date || "N/A"}
            </p>
            <p style={styles.text}>
              <strong>Time:</strong> {ride.time || "N/A"}
            </p>
            <p style={styles.text}>
              <strong>From:</strong> {ride.fromLocation || "N/A"}
            </p>
            <p style={styles.text}>
              <strong>To:</strong> {ride.toLocation || "N/A"}
            </p>
          </div>
        ))}
      </div>

      <button onClick={handleGoBack} style={styles.goBackButton}>
        Go Back
      </button>
    </div>
  );
}

export default ScheduledRides;

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    maxWidth: "800px",
    margin: "20px auto",
  },
  heading: {
    textAlign: "center",
    fontSize: "2em",
    color: "#333",
    marginBottom: "20px",
  },
  cardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "20px",
  },
  card: {
    padding: "15px",
    backgroundColor: "#ffffff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  text: {
    fontSize: "1em",
    margin: "8px 0",
    color: "#555",
  },
  goBackButton: {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "1em",
    backgroundColor: "#2191FB",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    width: "100%",
  },
};
