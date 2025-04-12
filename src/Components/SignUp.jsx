import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Typography, Box, CircularProgress } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import '../Styles/Login.css';
import Cookies from 'js-cookie';

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState('email');
  const [otp, setOtp] = useState('');

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  // For OTP resend functionality
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(30);

  // Effect to handle countdown timer when OTP is sent.
  useEffect(() => {
    let interval;
    if (!canResend && step === 'otp') {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            setCanResend(true);
            return 30; // reset timer for next time
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [canResend, step]);

  const sendOtp = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    const sanitizedEmail = email.trim().toLowerCase();

    try {
      setError(null);
      const res = await fetch(
        'https://swyft-backend-client-nine.vercel.app/signup-otp',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: sanitizedEmail }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to send OTP');
        return;
      }

      setSuccess('OTP sent to your email.');
      setStep('otp');
      setCanResend(false); // disable resend until timer finishes
    } catch {
      setError('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        'https://swyft-backend-client-nine.vercel.app/verify-signup-otp',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp: otp }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Invalid OTP');
        return;
      }

      setSuccess('OTP verified!');
      setStep('form');
    } catch {
      setError('Verification failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

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

    const userId = uuidv4();
    const sanitizedEmail = email.trim().toLowerCase();

    const signupData = {
      id: userId,
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

      if (!response.ok) {
        setError(responseData.message || 'Sign-up failed. Please try again.');
        return;
      }

      setSuccess(responseData.message || 'Account created successfully!');

      // Save user data in cookies
      const userData = {
        id: userId,
        name,
        phone: phoneNumber,
        email: sanitizedEmail,
      };
      Cookies.set('user', JSON.stringify(userData));
      Cookies.set('authTokencl1', responseData.access_token, {
        secure: true,
        sameSite: 'Strict',
      });

      // Navigate to home (the App.jsx logic will then show the install popup if needed)
      navigate('/');
    } catch (err) {
      console.error('An error occurred during sign-up:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-component">
      <Box className="login-container">
        <header className="login-header">Create an Account</header>
        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="primary">{success}</Typography>}

        <form onSubmit={signUp}>
          {step === 'email' && (
            <>
              <input
                placeholder="Email"
                type="email"
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={sendOtp}
                className="login-button"
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={34} color="inherit" />
                ) : (
                  'Send OTP'
                )}
              </button>
            </>
          )}

          {step === 'otp' && (
            <>
              <input
                placeholder="Enter OTP"
                className="login-input"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={verifyOtp}
                className="login-button"
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={34} color="inherit" />
                ) : (
                  'Verify OTP'
                )}
              </button>

              {/* Resend OTP Section */}
              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={sendOtp}
                  className="resend-button"
                  disabled={loading || !canResend}
                  style={{ padding: '0.5rem 1rem' }}
                >
                  {loading ? (
                    <CircularProgress size={34} color="inherit" />
                  ) : canResend ? (
                    'Resend OTP'
                  ) : (
                    `Resend OTP in ${timer}s`
                  )}
                </button>
              </div>
            </>
          )}
          {step === 'form' && (
            <>
              <input
                placeholder="Name or Username"
                className="login-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
              <button type="submit" className="login-button" disabled={loading}>
                {loading ? (
                  <CircularProgress size={34} color="inherit" />
                ) : (
                  'Sign Up'
                )}
              </button>
            </>
          )}
        </form>
        <Link
          to="/"
          className="existing-account"
          style={{
            marginTop: '2vh',
            marginBottom: '2vh',
            color: '#00D46A',
            fontSize: '15px',
            fontFamily: 'Montserrat',
            display: 'block',
            textAlign: 'center',
            cursor: 'pointer',
          }}
        >
          Already have an account? Log in
        </Link>
      </Box>
    </div>
  );
};

export default SignUp;
