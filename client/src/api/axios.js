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

export default api;
