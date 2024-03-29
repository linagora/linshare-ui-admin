export const CONFIG = {
  API: {
    BASE_URL: 'linshare/webservice/rest/admin/v5',
    DEFAULT_HEADERS: {
      'WWW-No-Authenticate': 'linshare',
    },
  },
};

export const CONFIGV4 = {
  API: {
    BASE_URL: 'linshare/webservice/rest/admin/v4',
    DEFAULT_HEADERS: {
      'WWW-No-Authenticate': 'linshare',
    },
  },
};

export * from './languages';
export * from './permissions';
export * from './pagination';
export * from './api-errors';
