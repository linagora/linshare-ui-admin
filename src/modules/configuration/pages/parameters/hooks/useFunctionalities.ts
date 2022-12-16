import { computed, ComputedRef, Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Functionality } from '@/modules/configuration/pages/parameters/types/Functionality';

type UsableFunctionalities = {
  getTranslatedText: (functionality: Functionality, key: string) => string;
};

export default function useFunctionalities(): UsableFunctionalities {
  const { t } = useI18n();

  function getTranslatedText(functionality: Functionality, key: string): string {
    const i18nKey = `FUNCTIONALITIES.DETAILS.${functionality.identifier}.${key}`;
    const i18nValue = t(i18nKey);

    return i18nValue === i18nKey ? t(`FUNCTIONALITIES.DEFAULT.${key}`) : i18nValue;
  }

  return {
    getTranslatedText,
  };
}
