import axios, { AxiosResponse } from 'axios';
import router from '@/core/router';
import { CONFIG } from '@/core/constants';
import { APIError, LinShareAPIError } from '@/core/types/APIError';
import type { PaginatedList } from '@/core/types/PaginatedList';
import { dehydrate } from '@/core/store/hydrate';

const api = axios.create({
  baseURL: `${window.location.origin}/${CONFIG.API.BASE_URL}`,
  headers: CONFIG.API.DEFAULT_HEADERS,
  paramsSerializer(params) {
    return Object.entries(params)
      .filter(([key, value]) => !!value)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return value.map((v) => `${key}=${v}`).join('&');
        }

        return `${key}=${value}`;
      })
      .join('&');
  },
});

api.interceptors.response.use(onResponse, onError);

function onResponse(response: AxiosResponse): PaginatedList<any> | any {
  const headers = response.headers;

  if (headers['total-elements']) {
    return {
      data: response.data,
      total: +(headers ? headers['total-elements'] : 0),
      current: +(headers ? headers['current-page'] : 0),
      totalPages: +(headers ? headers['total-pages'] : 0),
    };
  }

  return response.data;
}

function onError(e: LinShareAPIError): APIError {
  const error = new APIError(e);

  if (error.isUnauthorizedError()) {
    dehydrate();
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
