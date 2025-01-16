import { supabase } from './SupabaseClient'; // Import the configured Supabase client
import { Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

//eslint-disable-next-line
const GoogleLogin = ({ setLoading, setError, dispatch, addUser, navigate }) => {
  const handleSignInWithGoogle = async () => {
    setLoading(true);
    try {
      const { user, session, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) {
        throw error;
      }

      if (user && session) {
        dispatch(addUser(user));
        sessionStorage.setItem('authToken', session.access_token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('status', 'user logged in!');
        navigate('/');
      } else {
        setError('Could not retrieve user data after Google Sign-In.');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSignInWithGoogle}
      variant="contained"
      color="primary"
      sx={{
        mt: 2,
        backgroundColor: '#4285F4',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
      }}
    >
      <GoogleIcon sx={{ marginRight: '10px' }} />
      Sign in with Google
    </Button>
  );
};

export default GoogleLogin;
