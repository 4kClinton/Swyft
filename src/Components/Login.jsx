import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Typography,
  Box,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
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
  const user = useSelector((state) => state.user.value);

  // States for Install Prompt
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPopup, setShowInstallPopup] = useState(false);

  // Capture the beforeinstallprompt event
  useEffect(() => {
    const handler = (e) => {
      // Prevent the default mini-infobar from appearing
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPopup(true);
      console.log('beforeinstallprompt event captured');
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      // Clear the deferred prompt variable, since it can only be used once.
      setDeferredPrompt(null);
      setShowInstallPopup(false);
    }
  };

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
        'https://swyft-backend-client-nine.vercel.app/login',
        { email: email.trim().toLowerCase(), password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      setSuccess(response.data.message || 'OTP sent to your email');
      setStep(2); // Move to OTP verification step
    } catch (err) {
      console.error(err.response);
      setError(
        err.response?.data?.error || 'An error occurred. Please try again.'
      );
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
        'https://swyft-backend-client-nine.vercel.app/verify-otp',
        { email, otp },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const { access_token, user, message } = response.data;

      Cookies.set('authTokencl1', access_token, {
        secure: true,
        sameSite: 'Strict',
      });
      dispatch(addUser(user));
      Cookies.set('message', message);
      Cookies.set('user', JSON.stringify(user));
      Cookies.set('status', 'user logged in!');

      setSuccess(message || 'Login successful!');

      setTimeout(() => {
        navigate('/dash');
      }, 3000);
    } catch (err) {
      console.error(err.response);
      setError(err.response?.data?.error || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      navigate('/dash');
    }
  }, [user, navigate]);

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
              {loading ? (
                <CircularProgress
                  className="login-loader"
                  size={34}
                  color="#fff"
                />
              ) : (
                'Log In'
              )}
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
              {loading ? (
                <CircularProgress
                  className="login-loader"
                  size={34}
                  color="#fff"
                />
              ) : (
                'Verify OTP'
              )}
            </button>
          </form>
        )}

        <Button
          onClick={() => navigate('/signup')}
          variant="text"
          sx={{
            mt: 2,
            color: '#18b700',
            fontWeight: 'bold',
            fontFamily: 'Montserrat',
          }}
        >
          Create account
        </Button>
      </Box>

      {/* Install Popup */}
      {showInstallPopup && (
        <div className="install-popup">
          <Box
            sx={{
              position: 'fixed',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              zIndex: 1000,
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              Install Swyft?
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Get a better experience by installing our app.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleInstallClick}
              sx={{ mr: 1 }}
            >
              Install
            </Button>
            <Button
              variant="outlined"
              onClick={() => setShowInstallPopup(false)}
            >
              Close
            </Button>
          </Box>
        </div>
      )}
    </div>
  );
};

export default Login;
