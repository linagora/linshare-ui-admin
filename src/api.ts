import axios, { AxiosError, AxiosResponse } from 'axios';
import { CONFIG } from './core/constants';
import { APIError } from '@/core/types/APIError';
import router from './core/router';

const api = axios.create({
  baseURL: `${window.location.origin}/${CONFIG.API.BASE_URL}`,
  headers: CONFIG.API.DEFAULT_HEADERS
});

api.interceptors.response.use(onResponse, onError);

function onResponse (response: AxiosResponse): AxiosResponse {
  return response.data;
}

function onError (e: AxiosError): Promise<APIError> {
  const error = new APIError(e);

  if (error.isUnauthorizedError()) {
    router.push({
      name: 'Login',
      params: {
        redirect: router.currentRoute.value.fullPath
      }
    });
  }

  throw error;
}

export default api;
