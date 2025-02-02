import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: 'https://swyft-backend-client-nine.vercel.app/', // Backend URL
  withCredentials: true, // Important for sending cookies
});

// Interceptor to add Access Token
axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(
          'https://swyft-backend-client-nine.vercel.app/',
          {},
          { withCredentials: true }
        );
        Cookies.set('authTokencl1', data.access_token, {
          expires: 7,
          secure: true,
          sameSite: 'Strict',
        }); // Update Access Token
        axiosInstance.defaults.headers['Authorization'] =
          `Bearer ${data.accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Refresh Token failed', refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
