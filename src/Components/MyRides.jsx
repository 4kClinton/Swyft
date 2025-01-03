import React, { useState, useEffect } from "react";
import {
 
  CircularProgress,

} from "@mui/material";
function RidesHistory() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Replace this URL with your actual API endpoint
    fetch("https://swyft-backend-client-eta.vercel.app/rides")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch rides history");
        }
        return response.json();
      })
      .then((data) => {
        setRides(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <p>
      <CircularProgress className="login-loader" size={34} color="#0000" />
      Loading rides history...
    </p>
  );
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Rides History</h2>
      <div style={styles.rideList}>
        {rides.map((ride) => (
          <div key={ride.id} style={styles.rideCard}>
            <div style={styles.rideInfo}>
              <p style={styles.date}>{ride.date}</p>
              <p style={styles.route}>
                {ride.fromLocation} → {ride.toLocation}
              </p>
              <p style={styles.fare}>Fare: Ksh {ride.fare}</p>
            </div>
            <div style={styles.status}>
              <span
                style={
                  ride.status === "Completed"
                    ? styles.completed
                    : styles.canceled
                }
              >
                {ride.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RidesHistory;

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f4f8",
    maxWidth: "600px",
    margin: "0 auto",
  },
  heading: {
    fontSize: "1.5em",
    color: "#333",
    marginBottom: "20px",
  },
  rideList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  rideCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  rideInfo: {
    display: "flex",
    flexDirection: "column",
  },
  date: {
    fontSize: "0.9em",
    color: "#888",
    marginBottom: "5px",
  },
  route: {
    fontSize: "1em",
    color: "#333",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  fare: {
    fontSize: "0.9em",
    color: "#555",
  },
  status: {
    fontSize: "0.9em",
    fontWeight: "bold",
  },
  completed: {
    color: "#4CAF50", // Green for completed rides
  },
  canceled: {
    color: "#FF5252", // Red for canceled rides
  },
};
