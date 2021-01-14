import { LANGUAGES } from '@/core/constants';

/**
 * I18n service
 *
 * This service stores selected locale in LocalStorage.
 */
class I18nService {
  private localStorage: Storage;

  constructor () {
    if (!window.localStorage) {
      console.warn('Local storage is not supported by your browser. English will be used as the default language.');
    }

    this.localStorage = window.localStorage;
  }

  setLocale (locale: string) {
    if (!this.localStorage) return;

    if (LANGUAGES.SUPPORTED_LOCALES.indexOf(locale) === -1) {
      console.warn(`The locale is not supported: ${locale}`);

      return;
    }

    localStorage.setItem('locale', locale);
  }

  getLocale (): string {
    if (!this.localStorage) return LANGUAGES.DEFAULT;

    return localStorage.getItem('locale') || LANGUAGES.DEFAULT;
  }
}

export default new I18nService();
