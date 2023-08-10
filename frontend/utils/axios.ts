import axios from "axios";
import { getAccessToken } from "@/utils/AuthService";

export const ApiClient = axios.create({
  baseURL: "http://localhost:3001",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json"
  }
});

ApiClient.interceptors.request.use(
  (config) => {
    const newConfig = { ...config };
    if (getAccessToken()) {
      newConfig.headers.Authorization = `Bearer ${getAccessToken()}`;
    }
    return newConfig;
  },
  (error) => Promise.reject(error)
);
