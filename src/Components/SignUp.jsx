import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Typography, Box, CircularProgress, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from 'react-redux';
import { addUser } from '../Redux/Reducers/UserSlice';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../Styles/Login.css';

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Step 1: sign-up form; Step 2: OTP verification
  const [step, setStep] = useState(1);

  // Common states
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sign-up specific states
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // OTP specific state
  const [otp, setOtp] = useState('');

  // For toggling password visibility
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Sign-up submission that sends the OTP email
  const signUp = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    const newUserId = uuidv4();
    const sanitizedEmail = email.trim().toLowerCase();

    const signupData = {
      id: newUserId,
      name,
      phone: phoneNumber,
      email: sanitizedEmail,
      password,
    };

    try {
      const response = await fetch(
        'https://swyft-backend-client-nine.vercel.app/signup',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(signupData),
        }
      );
      const responseData = await response.json();

      // Debug: log the signup response from the server
      console.log('Signup Response:', responseData);

      if (!response.ok) {
        setError(responseData.message || 'Sign-up failed. Please try again.');
        setLoading(false);
        return;
      }

      setSuccess(responseData.message || 'OTP sent to your email');
      setStep(2);
    } catch (err) {
      console.error('An error occurred during sign-up:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // OTP verification function
  const verifyOtp = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(
        'https://swyft-backend-client-nine.vercel.app/verify-otp',
        { email: email.trim().toLowerCase(), otp },
        { headers: { 'Content-Type': 'application/json' } }
      );

      // Debug: log the OTP verification response from the server
      console.log('OTP Verification Response:', response.data);

      const { access_token, user, message } = response.data;

      Cookies.set('authTokencl1', access_token, {
        secure: true,
        sameSite: 'Strict',
      });
      dispatch(addUser(user));
      Cookies.set('user', JSON.stringify(user));

      setSuccess(message || 'Sign-up successful!');

      setTimeout(() => {
        navigate('/dash');
      }, 3000);
    } catch (err) {
      console.error('OTP Verification Error:', err.response);
      setError(err.response?.data?.error || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP function
  const resendOtp = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await axios.post(
        'https://swyft-backend-client-nine.vercel.app/resend-otp',
        { email: email.trim().toLowerCase() },
        { headers: { 'Content-Type': 'application/json' } }
      );

      // Debug: log the resend OTP response from the server
      console.log('Resend OTP Response:', response.data);

      setSuccess(response.data.message || 'OTP resent successfully!');
    } catch (err) {
      console.error('Resend OTP Error:', err.response);
      setError(
        err.response?.data?.error || 'Failed to resend OTP. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-component">
      <Box className="login-container">
        {step === 1 ? (
          <>
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
                type="email"
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
              <input
                placeholder="Confirm Password"
                type="password"
                className="login-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button type="submit" className="login-button" disabled={loading}>
                {loading ? (
                  <CircularProgress size={34} color="inherit" />
                ) : (
                  'Sign Up'
                )}
              </button>
            </form>
            <Link
              to="/"
              className="existing-account"
              style={{
                marginTop: '2vh',
                marginBottom: '2vh',
                color: '#00D46A',
                fontSize: '15px',
                display: 'block',
                textAlign: 'center',
                cursor: 'pointer',
              }}
            >
              Already have an account? Log in
            </Link>
          </>
        ) : (
          <>
            <header className="login-header">Verify OTP</header>
            {error && <Typography color="error">{error}</Typography>}
            {success && (
              <div className="success-popup">
                <Typography color="success" align="center">
                  {success}
                </Typography>
              </div>
            )}
            <form onSubmit={verifyOtp}>
              <input
                placeholder="Enter OTP"
                type="text"
                className="login-input"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button type="submit" className="login-button" disabled={loading}>
                {loading ? (
                  <CircularProgress size={34} color="inherit" />
                ) : (
                  'Verify OTP'
                )}
              </button>
            </form>
            <Typography
              align="center"
              style={{
                marginTop: '10px',
                color: '#00D46A',
                cursor: 'pointer',
              }}
              onClick={resendOtp}
            >
              Resend OTP
            </Typography>
          </>
        )}
      </Box>
    </div>
  );
};

export default SignUp;
