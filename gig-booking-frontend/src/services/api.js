import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // backend root
  timeout: 15000,
});

export default api;
