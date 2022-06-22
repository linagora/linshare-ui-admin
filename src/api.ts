import axios, { AxiosResponse } from 'axios';
import { CONFIG } from './core/constants';
import { APIError, LinShareAPIError } from '@/core/types/APIError';
import router from './core/router';

const api = axios.create({
  baseURL: `${window.location.origin}/${CONFIG.API.BASE_URL}`,
  headers: CONFIG.API.DEFAULT_HEADERS,
});

api.interceptors.response.use(onResponse, onError);

function onResponse(response: AxiosResponse) {
  const headers = response.headers;

  if (headers['total-elements'] && headers['current-page']) {
    return {
      data: response.data,
      total: +(headers ? headers['total-elements'] : 0),
      current: +(headers ? headers['current-page'] : 0),
    };
  }

  return response.data;
}

function onError(e: LinShareAPIError): APIError {
  const error = new APIError(e);

  if (error.isUnauthorizedError()) {
    router.push({
      name: 'Login',
      params: {
        redirect: router.currentRoute.value.fullPath,
      },
    });
  }

  throw error;
}

export default api;
