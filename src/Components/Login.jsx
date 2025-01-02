import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  Box,
  CircularProgress,
  IconButton,
} from "@mui/material";
import {
  Google,
  Twitter,
  GitHub,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { addUser } from "../Redux/Reducers/UserSlice";
import axios from "axios";
import { supabase } from "../Components/SupabaseClient"; // Ensure you have this file for Supabase initialization
import "../Styles/Login.css";

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
        "https://swyft-backend-client-git-nelson-orinas-projects.vercel.app/login",
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

  // Google SignIn with Supabase
  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const { user, session, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) throw error;
      if (user) {
        dispatch(addUser(user));
        sessionStorage.setItem("authToken", session.access_token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("status", "user logged in!");
        navigate("/"); // Redirect to home after successful login
      }
    } catch (error) {
      setError(error.message);
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
              <CircularProgress size={34} color="inherit" />
            ) : (
              "Log In"
            )}
          </button>
        </form>

        {/* Google Login Button */}
        {/* <Button
          onClick={signInWithGoogle}
          variant="contained"
          color="primary"
          sx={{
            mt: 2,
            backgroundColor: "#4285F4",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "80%",
          }}
        >
          <Google sx={{ marginRight: "10px" }} />
          Sign in with Google
        </Button> */}

        <Button
          onClick={() => navigate("/signup")}
          variant="text"
          sx={{ mt: 2, color: "#18b700", fontWeight: "bold" }}
        >
          Create account
        </Button>
      </Box>
    </div>
  );
};

export default Login;
