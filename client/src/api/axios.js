import axios from "axios";

// Access environment variable using import.meta.env
const API_URL = import.meta.env.VITE_API_URL;

console.log("API_URL: ", API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add request interceptor to log URLs (helpful for debugging)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
