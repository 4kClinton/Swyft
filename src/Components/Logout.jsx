import axiosInstance from '../axios';

const Logout = () => {
  const handleLogout = async () => {
    try {
      await axiosInstance.post('/logout');
      localStorage.removeItem('accessToken'); // Clear tokens
      window.location.href = '/';
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
