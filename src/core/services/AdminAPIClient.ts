import axios, { AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
import router from '@/core/router';
import { CONFIG } from '@/core/constants';
import { AuthError } from '@/modules/auth/services/AuthAPIClient';

interface ClientConfig {
  useAuthInterceptor?: boolean;
  responseDataOnly?: boolean;
}
export default abstract class AdminAPIClient {
  transport: AxiosInstance;
  clientConfig: ClientConfig;

  constructor (baseURL: string, config: AxiosRequestConfig = {}, clientConfig: ClientConfig = {}) {
    this.clientConfig = {
      ...{
        useAuthInterceptor: true,
        responseDataOnly: true
      },
      ...clientConfig
    };
    this.transport = axios.create({
      baseURL: `${window.location.origin}/${CONFIG.API.BASE_URL}/${baseURL}`,
      headers: {
        ...CONFIG.API.DEFAULT_HEADERS,
        ...(config.headers || {})
      },
      ...config
    });

    this.transport.interceptors.response.use(this.handleResponse, this.handleAuthError);
  }

  private handleResponse = (response: AxiosResponse) => {
    return this.clientConfig.responseDataOnly ? response.data : response;
  };

  private handleAuthError = (error: AxiosError) => {
    const authError = new AuthError(error);

    if (authError.isCommonError() && this.clientConfig.useAuthInterceptor) {
      router.push({ name: 'login', params: { redirect: router.currentRoute.value.fullPath } });
    }

    throw error;
  };
}
