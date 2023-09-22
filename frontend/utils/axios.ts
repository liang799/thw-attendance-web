import axios from 'axios';
import { getAccessToken } from '@/utils/auth';


const baseUrls = determineUrls();

export const ApiClient = axios.create({
  baseURL: baseUrls[0],
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let currentBaseUrlIndex = 0;
ApiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status > 500) {
      currentBaseUrlIndex = (currentBaseUrlIndex + 1) % baseUrls.length;
      ApiClient.defaults.baseURL = baseUrls[currentBaseUrlIndex];
      console.info(`Switched to base URL: ${baseUrls[currentBaseUrlIndex]}`);
    }
    return Promise.reject(error);
  },
);

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
  (error) => Promise.reject(error),
);


function determineUrls(): string[] {
  if (process.env.NEXT_PUBLIC_BACKEND_URLS) {
    return process.env.NEXT_PUBLIC_BACKEND_URLS.split(' ');
  }
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return [process.env.NEXT_PUBLIC_BACKEND_URL];
  }
  return ['localhost:3000'];
}