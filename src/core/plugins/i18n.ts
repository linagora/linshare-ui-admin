import { createI18n } from 'vue-i18n';
import i18nService from '@/core/i18n';
import messages from '@/core/i18n/locales';

const locale = i18nService && i18nService.getLocale();
const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale,
  messages
});

export default i18n;
