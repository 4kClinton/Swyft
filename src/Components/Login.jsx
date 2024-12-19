import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Box, Link, CircularProgress } from "@mui/material";
import { Google, Twitter, GitHub } from "@mui/icons-material";
import "../Styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // State for success message
  const [loading, setLoading] = useState(false);

  // Log-In function using Backend API
  const logIn = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null); // Reset success message on new submission

    try {
      const response = await fetch(
        "https://swyft-server-t7f5.onrender.com/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        setError(data.message || "Login failed. Please try again.");
      } else {
        const { access_token, user, message } = data; // Get access_token, user and message

        // Map access_token to authToken in sessionStorage
        sessionStorage.setItem("authToken", access_token); // Store the access_token as authToken

        // Store user data in sessionStorage
        sessionStorage.setItem("user", JSON.stringify(user)); // Store user details (including ID)

        // Store the server response message in sessionStorage
        sessionStorage.setItem("message", message || "Login successful!"); // Save the message in sessionStorage

        // Optionally, store the token in localStorage
        localStorage.setItem("user", JSON.stringify(user));

        console.log("Storing user data:", data); // Log user data before storing

        // Save "user logged in!" to local storage and log it in the console
        localStorage.setItem("status", "user logged in!");
        console.log("user logged in!");
        console.log(sessionStorage);

        // Display success message
        setSuccess(message || "Login successful!");

        // Redirect after a short delay
        setTimeout(() => {
          navigate("/"); // Redirect to the home page after login
        }, 3000); // 3 seconds
      }
    } catch (err) {
      console.error("Error occurred during login:", err);
      setError("An error occurred. Please try again.");
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
              <CircularProgress size={24} color="inherit" />
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
