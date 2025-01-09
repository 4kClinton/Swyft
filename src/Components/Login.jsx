import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  Box,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { addUser } from "../Redux/Reducers/UserSlice";
import axios from "axios";
import GoogleLogin from "./GoogleLogin"; // Make sure this import is correct
import "../Styles/Login.css";
import introPic from "../assets/loaders-swyft.png"

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const logIn = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(
        "https://swyft-backend-client-ac1s.onrender.com/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const { access_token, user, message } = response.data;

      sessionStorage.setItem("authToken", access_token);
      dispatch(addUser(user));
      sessionStorage.setItem("message", message || "Login successful!");
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("status", "user logged in!");

      setSuccess(message || "Login successful!");
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "An error occurred. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-component">
      <img className="introPic" src={introPic} alt="intro pic" />
      <Box className="login-container" id="login-section">
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
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Box className="input-container">
            <input
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <IconButton
              aria-label="toggle password visibility"
              onClick={togglePasswordVisibility}
              className="password-toggle"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </Box>

          <button
            variant="contained"
            color="success"
            type="submit"
            className="login-button"
            sx={{ mt: 2, backgroundColor: "#18b700", fontWeight: "bold" }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress
                className="login-loader"
                size={34}
                color="#fff"
              />
            ) : (
              "Log In"
            )}
          </button>
        </form>

        {/* Pass the necessary props to GoogleLogin  */}
        {/* <GoogleLogin
          setLoading={setLoading}
          setError={setError}
          dispatch={dispatch}
          addUser={addUser}
          navigate={navigate}
        /> */}

        <Button
          onClick={() => navigate("/signup")}
          variant="text"
          sx={{
            mt: 2,
            color: "#18b700",
            fontWeight: "bold",
            fontFamily: "Montserrat",
          }}
        >
          Create account
        </Button>
      </Box>
    </div>
  );
};

export default Login;
