import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import router from '@/core/router';
import { CONFIG } from '@/core/constants';

export default abstract class AdminAPIClient {
  transport: AxiosInstance;

  constructor (baseURL: string, config?: AxiosRequestConfig) {
    config = config || {};

    this.transport = axios.create({
      baseURL: `${window.location.origin}/${CONFIG.API.BASE_URL}/${baseURL}`,
      headers: {
        ...CONFIG.API.DEFAULT_HEADERS,
        ...(config.headers || {})
      },
      ...config
    });

    this.transport.interceptors.response.use(res => res.data, this.handleAuthError);
  }

  private handleAuthError = (error: AxiosError) => {
    if (error.response?.status === 401) {
      router.push('/login');
    }

    throw error;
  };
}
