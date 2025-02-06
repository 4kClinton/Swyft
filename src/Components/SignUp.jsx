import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Typography,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import PhoneNumberInput from './PhoneVerification';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import '../Styles/Login.css';

const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;


const supabase = createClient(supabaseUrl, anonKey);

import '../Styles/Login.css';
import Cookies from 'js-cookie';


const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otpDialog, setOtpDialog] = useState(false);
  const [otp, setOtp] = useState('');

  // Send OTP
  const sendOtp = async () => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) {
      setError(error.message);
    } else {
      setOtpDialog(true);
    }
    setLoading(false);
  };

  // Verify OTP and log in user
  const verifyOtp = async () => {
    setLoading(true);
    setError(null);

    console.log('Entered OTP:', otp);
    const { error } = await supabase.auth.verifyOtp({ phone, token: otp });
    if (error) {
      setError('Invalid OTP. Please try again.');
    } else {
      completeSignUp(); // Proceed with sign-up
    }
    setLoading(false);
  };

  // Complete sign-up and log in
  const completeSignUp = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    const userId = uuidv4();
    const signupData = { id: userId, name, phone, email, password };

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
      if (!response.ok) {
        setError(responseData.message || 'Sign-up failed. Please try again.');
        return;
      }
      // Set success message from server
      setSuccess(responseData.message || 'Welcome to Swyft!');

      // Save user data (excluding password) locally
      const userData = {
        id: userId,
        name,
        phone: phoneNumber,
        email,
      };
      Cookies.set('user', JSON.stringify(userData), { expires: 7 });

      Cookies.set('authToken', responseData.access_token, {
        expires: 7,
        secure: true,
        sameSite: 'Strict',
      }); // Set cookie with options

      // Redirect to the home route on successful sign-up
      setTimeout(() => navigate('/'), 3000); // Redirect after showing success message

    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-component">
      <Box className="login-container">
        <header className="login-header">Create an Account</header>
        {error && <Typography color="error">{error}</Typography>}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendOtp();
          }}
        >
          <input
            placeholder="Name"
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
          <PhoneNumberInput phone={phone} setPhone={setPhone} />
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
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (
              <CircularProgress size={30} sx={{ color: '#fff' }} />
            ) : (
              'Sign Up'
            )}
          </button>
        </form>
        <Link to={'/'} className="existing-account">
          Already have an account? Log in
        </Link>
      </Box>

      {/* OTP Verification Popup */}
      <Dialog open={otpDialog} onClose={() => setOtpDialog(false)}>
        <DialogTitle>Enter OTP</DialogTitle>
        <DialogContent>
          <input
            placeholder="OTP Code"
            className="login-input"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOtpDialog(false)}>Cancel</Button>
          <Button onClick={verifyOtp} color="primary">
            Verify
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SignUp;
