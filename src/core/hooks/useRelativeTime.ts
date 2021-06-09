import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
interface Unit {
  max: number;
  value: number;
  name: Intl.RelativeTimeFormatUnit;
}

const UNITS: Unit[] = [
  { max: 2760000, value: 60000, name: 'minute' },
  { max: 72000000, value: 3600000, name: 'hour' },
  { max: 518400000, value: 86400000, name: 'day' },
  { max: 2419200000, value: 604800000, name: 'week' },
  { max: 28512000000, value: 2592000000, name: 'month' },
  { max: Infinity, value: 31536000000, name: 'year' }
];

export default function useRelativeTime (from: Date | string | number) {
  const { locale, t } = useI18n();
  const { abs, round } = Math;
  const diff = +new Date(from) - +new Date();

  if (abs(diff) < 60000) {
    return computed(() => t('GENERAL.JUST_NOW', locale.value));
  }

  for (const unit of UNITS) {
    if (abs(diff) < unit.max) {
      return computed(() => new Intl.RelativeTimeFormat(locale.value).format(round(diff / unit.value), unit.name));
    }
  }
}
