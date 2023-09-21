import axios from "axios";
import { getAccessToken } from "@/utils/auth";

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
    try {
      const token = getAccessToken();
      newConfig.headers.Authorization = `Bearer ${token}`;
    } catch (e) {
      console.info('Cant get JWT token');
    }
    return newConfig;
  },
  (error) => Promise.reject(error)
);
