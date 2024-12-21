import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import * as jwtDecode from "jwt-decode";
import "../Styles/Account.css";

// Function to fetch user details using axios
const fetchUserDetails = async (authToken, setUser, setError) => {
  try {
    const response = await axios.get(
      "https://swyft-server-t7f5.onrender.com/me",
      {
        headers: {
          Authorization: `Bearer ${authToken}`, // Pass the token in the Authorization header
        },
      }
    );

    // Set user data from the response
    setUser({
      name: response.data.name,
      email: response.data.email,
      picture: response.data.picture,
    });
  } catch (err) {
    setError(err.response?.data?.message || "Unable to fetch user details.");
  }
};

const Account = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get the authToken from sessionStorage
    const authToken = sessionStorage.getItem("authToken");

    if (authToken) {
      try {
        // Decode the JWT token to extract additional information if needed
        const decodedToken = jwtDecode(authToken);
        console.log("Decoded Token:", decodedToken);

        // Fetch the user details using the token
        fetchUserDetails(authToken, setUser, setError);
      } catch (decodeError) {
        setError("Invalid authentication token. Please log in again.");
      }
    } else {
      setError("No authentication token found. Please log in.");
    }
  }, []);

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="account-container">
      <div className="user-card">
        {user.picture && (
          <img
            src={user.picture}
            alt={`${user.name}'s avatar`}
            className="user-avatar"
          />
        )}
        <h2>{user.name}</h2>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
      </div>
      <div className="account-options">
        <h3>Account Options</h3>
        <ul>
          <li>
            <Link to="/scheduled-rides">Scheduled Rides</Link>
          </li>
          <li>
            <Link to="/rides-history">Ride History</Link>
          </li>
          <li>
            <Link to="/settings">Settings</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Account;
