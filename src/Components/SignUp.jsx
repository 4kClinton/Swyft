import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Typography, Box, CircularProgress } from "@mui/material";
import { Google, Twitter, GitHub } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid"; // Import uuid for generating unique IDs

import "../Styles/Login.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sign-Up function to register customer data
  const signUp = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    // Generate a unique user ID
    const userId = uuidv4();

    // Prepare signup data
    const signupData = {
      id: userId,
      name,
      phone: phoneNumber,
      email,
      password,
    };



    try {
      // Make a POST request to your Express server
      const response = await fetch(
        "https://swyft-backend-client-nine.vercel.app/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(signupData),
        }
      );

  

      const responseData = await response.json();
     

      if (!response.ok) {
        // Set error message from server
        setError(responseData.message || "Sign-up failed. Please try again.");
        return;
      }

      // Set success message from server
      setSuccess(responseData.message || "Account created successfully!");

      // Save user data (excluding password) locally
      const userData = {
        id: userId,
        name,
        phone: phoneNumber,
        email,
      };
      localStorage.setItem("user", JSON.stringify(userData));

      // Redirect to the home route on successful sign-up
      setTimeout(() => navigate("/"), 3000); // Redirect after showing success message
    } catch (err) {
      console.error("An error occurred during sign-up:", err);
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // toLogin function defined outside of signUp function
  const toLogin = () => {
    navigate("/login");
  };

  return (
    <div className="login-component">
      <Box className="login-container">
        <header className="login-header">Create an Account</header>
        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="primary">{success}</Typography>}
        <form onSubmit={signUp}>
          <input
            placeholder="Name or Username"
            className="login-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            placeholder="Email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            placeholder="Phone Number"
            className="login-input"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          <input
            placeholder="Password"
            type="password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            placeholder="Confirm Password"
            type="password"
            className="login-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            variant="contained"
            type="submit"
            className="login-button"
            sx={{
              mt: 2,
              backgroundColor: "#00D46A",
              fontWeight: "bold",
              color: "#ffff",
            }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={34} color="inherit" />
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {/* <Typography
          variant="body2"
          align="center"
          sx={{ mt: 4, fontWeight: "bold" }}
        >
          Or sign up with
        </Typography>
        <Box
          className="socials-container"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
            mt: 2,
          }}
        >
          <Button
            className="social-icon"
            color="primary"
            startIcon={<Google />}
            fullWidth
            sx={{ mr: 1 }}
          ></Button>
          <Button
            className="social-icon"
            color="primary"
            startIcon={<Twitter />}
            fullWidth
            sx={{ mx: 1 }}
          ></Button>
          <Button
            className="social-icon"
            color="primary"
            startIcon={<GitHub />}
            fullWidth
            sx={{ ml: 1 }}
          ></Button>
        </Box> */}

        <Link
          to={"/login"}
          variant="body2"
          className="existing-account"
          sx={{
            mt: 2,
            marginBottom: "2vh",
            color: "#00D46A",
            fontSize: "15px",
            display: "block",
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          Already have an account? Log in
        </Link>
      </Box>
    </div>
  );
};

export default SignUp;
