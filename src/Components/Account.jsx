import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import * as jwtDecode from "jwt-decode";
import "../Styles/Account.css";
import { useSelector } from "react-redux";
import userPic from "../assets/profile.jpeg";
import CircularProgress from "@mui/material/CircularProgress";
// Function to fetch user details using axios
const fetchUserDetails = async (authToken, setUser, setError) => {
  try {
    const response = await axios.get(
      "https://swyft-backend-client-ac1s.onrender.com/me",
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
      phone: response.data.phone,
    });
  } catch (err) {
    setError(err.response?.data?.message || "Unable to fetch user details.");
  }
};

const Account = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const theUser = useSelector((state) => state.user.value);

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!theUser?.name) {
    return <CircularProgress />;
  }

  return (
    <div className="account-container">
      <div className="user-card">
        <img
          src={userPic}
          alt={`${theUser.name}'s avatar`}
          className="user-avatar"
        />

        <h2>{theUser.name}</h2>
        <p>
          <strong>Email:</strong> {theUser.email}
        </p>
        <p>
          <strong>Phone:</strong> {theUser.phone}
        </p>
      </div>
    </div>
  );
};

export default Account;
