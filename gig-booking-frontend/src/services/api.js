import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // local backend
  timeout: 15000,
});

export default api;
