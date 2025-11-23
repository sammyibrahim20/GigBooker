import axios from "axios";

// Backend base URL:
// - Prefer REACT_APP_API_URL when defined
// - Use localhost:8080 during local dev
// - Fallback to Render backend in production
const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:8080"
    : "https://gigbooker-docker.onrender.com");

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

export default api;
