import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Box, Link } from "@mui/material";
import { Google, Twitter, GitHub } from "@mui/icons-material";
import "../Styles/Login.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState(""); // New state for name
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // New state for phone number
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sign-Up function to register customer data
  const signUp = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      // Make a POST request to your Express server
      const response = await fetch(
        "https://swyft-server-t7f5.onrender.com/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            phone: phoneNumber,
            email,
            password, // Make sure your server handles password storage properly (hashing, etc.)
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Sign-up failed. Please try again.");
      }

      // Optionally, handle the response here if needed
      navigate("/"); // Redirect to the home route on successful sign-up
    } catch (err) {
      console.error("An error occurred during sign-up:", err);
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-component">
      <Box className="login-container">
        <header className="login-header">Create an Account</header>
        {error && <Typography color="error">{error}</Typography>}
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
          <Button
            variant="contained"
            type="submit"
            className="login-button"
            sx={{ mt: 2, backgroundColor: "#18b700", fontWeight: "bold" }}
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </form>
        <Typography
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
        </Box>
        <Link
          href="/login"
          variant="body2"
          className="existing-account"
          align="center"
          sx={{ mt: 2, marginBottom : "2vh"}}
        >
          Already have an account? Log in
        </Link>
      </Box>
    </div>
  );
};

export default SignUp;
