import axios, { AxiosResponse } from 'axios';
import router from '@/core/router';
import { CONFIGV4 } from '@/core/constants';
import { APIError, LinShareAPIError } from '@/core/types/APIError';
import type { PaginatedList } from '@/core/types/PaginatedList';

const apiv4 = axios.create({
  baseURL: `${window.location.origin}/${CONFIGV4.API.BASE_URL}`,
  headers: CONFIGV4.API.DEFAULT_HEADERS,
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

apiv4.interceptors.response.use(onResponse, onError);

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
    router.push({
      name: 'Login',
      params: {
        redirect: router.currentRoute.value.fullPath,
      },
    });
  }

  throw error;
}

export default apiv4;
