import { computed, ComputedRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { LANGUAGES } from '@/core/constants';
import { Locale } from 'ant-design-vue/es/locale-provider';
import enUS from 'ant-design-vue/es/locale/en_US';
import frFR from 'ant-design-vue/es/locale/fr_FR';
import ruRU from 'ant-design-vue/es/locale/ru_RU';
import viVN from 'ant-design-vue/es/locale/vi_VN';
import esES from 'ant-design-vue/es/locale/es_ES';
import deDE from 'ant-design-vue/es/locale/de_DE';
import itIT from 'ant-design-vue/es/locale/it_IT';

const keyToLocaleMap = new Map<string, Locale>();

keyToLocaleMap.set('en', enUS);
keyToLocaleMap.set('fr', frFR);
keyToLocaleMap.set('ru', ruRU);
keyToLocaleMap.set('vi', viVN);
keyToLocaleMap.set('es', esES);
keyToLocaleMap.set('de', deDE);
keyToLocaleMap.set('it', itIT);

type AntConfig = {
  antdLocale: ComputedRef<Locale | undefined>;
};

export default function useAntConfig(): AntConfig {
  const { locale } = useI18n();
  const antdLocale = computed<Locale | undefined>(() =>
    keyToLocaleMap.has(locale.value) ? keyToLocaleMap.get(locale.value) : keyToLocaleMap.get(LANGUAGES.DEFAULT)
  );

  return {
    antdLocale,
  };
}
