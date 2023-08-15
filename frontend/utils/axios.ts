import axios from "axios";
import { getAccessToken } from "@/utils/AuthService";

export const ApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
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
