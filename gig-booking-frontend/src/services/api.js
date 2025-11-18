import axios from "axios";

const api = axios.create({
  baseURL: "https://gigbooker-docker.onrender.com", // backend root
  timeout: 15000,
});

export default api;
