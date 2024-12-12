import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Box, Link } from "@mui/material";
import { Google, Twitter, GitHub } from "@mui/icons-material";
import "../Styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Log-In function using Backend API
  const logIn = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

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

      if (!response.ok) {
        setError(data.message || "Login failed. Please try again.");
      } else {
        // Assuming the backend sends a token on successful login
        localStorage.setItem("authToken", data.token);
        navigate("/"); // Redirect to the home route on successful login
      }
    } catch (err) {
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
            color="#success"
            type="submit"
            className="login-button"
            sx={{ mt: 2, backgroundColor: "#18b700", fontWeight: "bold" }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
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
