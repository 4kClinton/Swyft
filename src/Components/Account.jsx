import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../Styles/Account.css";

// Function to fetch user details using authToken
const fetchUserDetails = async (authToken, setUser, setError) => {
  try {
    const response = await fetch("https://swyft-server-t7f5.onrender.com/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`, // Pass the token in the Authorization header
      },
    });

    const userData = await response.json();

    if (!response.ok) {
      throw new Error(userData.message || "Failed to fetch user details.");
    }

    setUser({
      name: userData.name,
      email: userData.email,
      picture: userData.picture,
    });
  } catch (err) {
    setError("Unable to fetch user details.");
  }
};

const Account = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get the authToken from sessionStorage
    const authToken = sessionStorage.getItem("authToken");

    if (authToken) {
      // If authToken is available, fetch the user details using the token
      fetchUserDetails(authToken, setUser, setError);
    } else {
      // If there's no authToken, show an error or prompt the user to log in
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
