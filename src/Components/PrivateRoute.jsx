import { Navigate } from 'react-router-dom';
import * as jwtDecode from 'jwt-decode'; // Ensure this is correctly imported

//eslint-disable-next-line
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');

  // Check if token exists
  if (!token) {
    return <Navigate to="/" />;
  }

  try {
    // Decode the token
    const { exp } = jwtDecode(token);

    // Check if the token has expired
    if (Date.now() >= exp * 1000) {
      localStorage.removeItem('accessToken'); // Clear the token from storage
      return <Navigate to="/" />;
    }
  } catch (error) {
    console.error('Error decoding token:', error);
    return <Navigate to="/" />; // Redirect on decode error
  }

  // Render children if the token is valid
  return children;
};

export default PrivateRoute;
