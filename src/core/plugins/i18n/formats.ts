import { IntlDateTimeFormats } from 'vue-i18n';

export const DATETIME_FORMATS: IntlDateTimeFormats = {
  en: {
    shortDate: {
      year: 'numeric',
      month: 'numeric',
      day: '2-digit',
    },
    mediumDate: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
    mediumDateTime: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    },
    customDateTime: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    },
  },
  fr: {
    shortDate: {
      year: 'numeric',
      month: 'numeric',
      day: '2-digit',
    },
    mediumDate: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
    mediumDateTime: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    },
    customDateTime: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    },
  },
  ru: {
    shortDate: {
      year: 'numeric',
      month: 'numeric',
      day: '2-digit',
    },
    mediumDate: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
    mediumDateTime: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    },
    customDateTime: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    },
  },
  vi: {
    shortDate: {
      year: 'numeric',
      month: 'numeric',
      day: '2-digit',
    },
    mediumDate: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
    mediumDateTime: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    },
    customDateTime: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    },
  },
};
