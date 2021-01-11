import { createI18n } from 'vue-i18n';
import i18nService from '@/core/services/I18nService';
import messages from '@/core/plugins/i18n/locales';
import datetimeFormats from './datetimeFormats';

const locale = i18nService && i18nService.getLocale();

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  datetimeFormats,
  locale,
  messages
});

export default i18n;
