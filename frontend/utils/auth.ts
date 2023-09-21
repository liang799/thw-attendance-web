import secureLocalStorage from 'react-secure-storage';
import { useEffect } from 'react';
import { ApiClient } from '@/utils/axios';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useToast } from '@chakra-ui/react';

export function getAccessToken(): string {
  const token = secureLocalStorage.getItem('token');
  console.log(token)
  if (!token) throw new Error('Cannot get token');
  return String(token);
}

export function setAccessToken(token: string) {
  secureLocalStorage.setItem('token', token);
}

export function clearLocalStorage() {
  secureLocalStorage.clear();
}

export function getUserId(): number {
  const userIdString = secureLocalStorage.getItem('userId');
  if (!userIdString) throw new Error('Cannot get User Id');
  return +userIdString;
}

export function setUserId(userId: number) {
  secureLocalStorage.setItem('userId', String(userId));
}

export const useAuthentication = () => {
  const router = useRouter();
  const toast = useToast();
  useEffect(() => {
    const interceptResponse = (error: AxiosError) => {
      if (error.response && error.response.status === 401) {
        toast({
          title: 'Token Expired',
          description: 'Your JWT token has expired, please login',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
        clearLocalStorage();
        return router.push('/');
      }
      return Promise.reject(error);
    };

    const interceptor = ApiClient.interceptors.response.use(
      response => response,
      interceptResponse,
    );

    return () => {
      ApiClient.interceptors.response.eject(interceptor);
    };
  }, []);
};
