import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:1010/api",
});

// 🔐 Attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🚨 Handle expired / invalid token globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {

      // Remove token
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      // Redirect to login
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;