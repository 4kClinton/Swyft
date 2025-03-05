import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Typography, Box, CircularProgress, Button } from '@mui/material';
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

  // Feedback states
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  // PWA install states
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPopup, setShowInstallPopup] = useState(false);

  // Listen for the beforeinstallprompt event
  useEffect(() => {
    const handler = (e) => {
      // Prevent the mini-infobar or automatic prompt
      e.preventDefault();
      // Save the event so we can call it later
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  // Trigger the browser's native install prompt
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);

      // Clear so it doesn't prompt again automatically
      setDeferredPrompt(null);
      // Close your custom popup
      setShowInstallPopup(false);
      // Optionally navigate somewhere after the prompt
      navigate('/');
    } else {
      console.log('No deferredPrompt available (iOS or not installable).');
    }
  };

  // Sign-up function
  const signUp = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Simple password match check
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
          headers: {
            'Content-Type': 'application/json',
          },
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
        email,
      };
      Cookies.set('user', JSON.stringify(userData));
      Cookies.set('authTokencl1', responseData.access_token, {
        secure: true,
        sameSite: 'Strict',
      });

      // Show your custom popup to trigger the install prompt
      setShowInstallPopup(true);
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
        </form>

        <Link
          to={'/'}
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
      </Box>

      {/* Custom Popup to Trigger the Browser's Install Prompt */}
      {showInstallPopup && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
          }}
        >
          <Box
            sx={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              padding: '32px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Montserrat' }}>
              Install Swyft
            </Typography>
            <Typography
              variant="body2"
              sx={{ mb: 2, fontFamily: 'Montserrat' }}
            >
              Get a better experience by installing our app.
            </Typography>

            <Button
              onClick={handleInstallClick}
              sx={{
                backgroundColor: '#00d46a',
                color: '#fff',
                border: 'none',
                textTransform: 'none',
                fontWeight: 'bold',
                padding: '8px 16px',
                '&:hover': {
                  backgroundColor: '#00c059',
                },
              }}
            >
              Install
            </Button>
          </Box>
        </div>
      )}
    </div>
  );
};

export default SignUp;
