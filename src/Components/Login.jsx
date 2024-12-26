import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Box, Link, CircularProgress } from "@mui/material";
import { Google, Twitter, GitHub } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import {addUser} from "../Redux/Reducers/UserSlice"
import axios from "axios";
import "../Styles/Login.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // State for success message
  const [loading, setLoading] = useState(false);

  // Log-In function using Backend API with Axios
  const logIn = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null); // Reset success message on new submission

    try {
      const response = await axios.post(
        "https://swyft-server-t7f5.onrender.com/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data;
      console.log(data);

      const { access_token, user, message } = data; // Get access_token, user, and message

      // Store the token and user information
      sessionStorage.setItem("authToken", access_token); // Store the access_token as authToken
     dispatch(addUser(user)) // Store user details
      sessionStorage.setItem("message", message || "Login successful!"); // Save the message

      // Optionally, store user details in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("status", "user logged in!");

      console.log("Storing user data:", data); // Log user data before storing

      // Display success message
      setSuccess(message || "Login successful!");

      // Redirect after a short delay
      setTimeout(() => {
        navigate("/"); // Redirect to the home page after login
      }, 3000); // 3 seconds
    } catch (err) {
      console.error("Error occurred during login:", err);
      const errorMessage =
        err.response?.data?.message || "An error occurred. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-component">
      <Box className="login-container">
        <header className="login-header">Log in to Swyft</header>

        {error && <Typography color="error">{error}</Typography>}

        {success && (
          <div className="success-popup">
            <Typography color="success" align="center">
              {success}
            </Typography>
          </div>
        )}

        <form onSubmit={logIn}>
          <input
            placeholder="Email or Username"
            variant="outlined"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            placeholder="Password"
            type="password"
            variant="outlined"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Link href="#" variant="body2" className="forgot-password">
            Forgot password?
          </Link>
          <Button
            variant="contained"
            color="success"
            type="submit"
            className="login-button"
            sx={{ mt: 2, backgroundColor: "#18b700", fontWeight: "bold" }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={34} color="inherit" />
            ) : (
              "Log In"
            )}
          </Button>
        </form>

        <Button
          onClick={() => navigate("/signup")}
          variant="text"
          className="create-account"
          align="center"
          sx={{ mt: 2, color: "#18b700", fontWeight: "bold" }}
        >
          Create account
        </Button>
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Or log in with
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
          />
          <Button
            className="social-icon"
            color="primary"
            startIcon={<Twitter />}
            fullWidth
            sx={{ mx: 1 }}
          />
          <Button
            className="social-icon"
            color="primary"
            startIcon={<GitHub />}
            fullWidth
            sx={{ ml: 1 }}
          />
        </Box>
      </Box>
    </div>
  );
};

export default Login;
