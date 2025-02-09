import axiosInstance from '../axios';
import Cookies from 'js-cookie';

const Logout = () => {
  const handleLogout = async () => {
    try {
      await axiosInstance.post('/logout');
      Cookies.remove('accessToken'); // Clear tokens
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
