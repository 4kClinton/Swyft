import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Typography,
  Box,
  CircularProgress,
  IconButton,
  TextField,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { addUser } from '../Redux/Reducers/UserSlice';
import axios from 'axios';
import Cookies from 'js-cookie';

import '../Styles/Login.css';
import introPic from '../assets/loaders-swyft.png';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Login, 2: OTP Verification
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

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
        ' http://127.0.0.1:5000/login',
        { email: email.trim().toLowerCase(), password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      setSuccess(response.data.message || 'OTP sent to your email');
      setStep(2); // Move to OTP verification step
    } catch (err) {
      console.error(err.response);
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(
        ' http://127.0.0.1:5000/verify-otp',
        { email, otp },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const { access_token, user, message } = response.data;

      Cookies.set('authToken', access_token, { expires: 7, secure: true, sameSite: 'Strict' });
      dispatch(addUser(user));

      setSuccess(message || 'Login successful!');
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      console.error(err.response);
      setError(err.response?.data?.error || 'Invalid OTP. Please try again.');
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

        {step === 1 ? (
          <form onSubmit={logIn}>
            <input
              placeholder="Email"
              type="email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Box className="input-container">
              <input
                placeholder="Password"
                type={showPassword ? 'text' : 'password'}
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
              type="submit"
              className="login-button"
              color="success"
              disabled={loading}
            >
              {loading ? (<CircularProgress className="login-loader" size={34} color="#fff" />) :( 'Log In')}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOtp}>
            <input
              placeholder="Enter OTP"
              type="text"
              className="login-input"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button
              type="submit"
              color="success"
              disabled={loading}
              className="login-button"
            >
              {loading ? (<CircularProgress className="login-loader" size={34} color="#fff" />) : ('Verify OTP')}
            </button>
          </form>
        )}

        <Button
          onClick={() => navigate('/signup')}
          variant="text"
          sx={{ mt: 2, color: '#18b700', fontWeight: 'bold', fontFamily: 'Montserrat' }}
        >
          Create account
        </Button>
      </Box>
    </div>
  );
};

export default Login;
