import axios from "axios";

// Pick the correct backend depending on environment:
// 1) REACT_APP_API_URL env var overrides everything
// 2) If running locally (localhost), default to the local Spring Boot port
// 3) Otherwise, use the deployed Render backend
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
