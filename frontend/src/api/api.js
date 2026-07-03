import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// ✅ Refresh Token Interceptor
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Avoid infinite loops
    if (originalRequest.url.includes("/api/auth/refresh") || originalRequest.url.includes("/api/auth/login")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh`, {}, { withCredentials: true });
        return API(originalRequest);
      } catch (err) {
        // If refresh fails, dispatch event to log out user
        window.dispatchEvent(new Event("auth-error"));
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default API;
