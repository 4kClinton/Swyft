import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://swyft-server-t7f5.onrender.com", // Backend URL
  withCredentials: true, // Important for sending cookies
});

// Interceptor to add Access Token
axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
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
          "https://swyft-server-t7f5.onrender.com",
          {},
          { withCredentials: true }
        );
        localStorage.setItem("accessToken", data.accessToken); // Update Access Token
        axiosInstance.defaults.headers[
          "Authorization"
        ] = `Bearer ${data.accessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh Token failed", refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
