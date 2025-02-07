import PropTypes from 'prop-types';
import { supabase } from './SupabaseClient'; // Import the configured Supabase client
import '../Styles/GoogleLogin.css';
import googleLogo from '../assets/gooogle.png';

const GoogleLogin = ({ setLoading, setError }) => {
  const handleSignInWithGoogle = async () => {
    if (typeof setLoading === 'function') setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          pkce: true,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      if (typeof setError === 'function') setError(error.message);
    } finally {
      if (typeof setLoading === 'function') setLoading(false);
    }
  };

  return (
    <button
      className="GoogleLogin"
      onClick={handleSignInWithGoogle}
      style={{
        marginTop: '8px',
        backgroundColor: '#4285F4',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
        padding: '10px',
        border: 'none',
        color: '#fff',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      <img
        src={googleLogo}
        alt="Google Logo"
        style={{ height: '20px', marginRight: '8px' }}
      />
      Continue with Google
    </button>
  );
};

// ✅ Adding PropTypes validation to fix ESLint errors
GoogleLogin.propTypes = {
  setLoading: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
};

export default GoogleLogin;
