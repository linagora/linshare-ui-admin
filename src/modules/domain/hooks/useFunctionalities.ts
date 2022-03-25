import { computed, ComputedRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { message } from 'ant-design-vue';
import { Functionality } from '@/core/types/Functionality';
import { APIError } from '@/core/types/APIError';
import StatusValue from '@/core/types/Status';

type UsableFunctionalities = {
  status: ComputedRef<StatusValue>;
  functionalities: ComputedRef<Functionality[]>;
  mainFunctionalities: ComputedRef<Functionality[]>;
  getTranslatedText: (functionality: Functionality, key: string) => string;
  saveFunctionality: (functionality: Functionality) => Promise<void>;
};

export default function useFunctionalities(): UsableFunctionalities {
  const { t } = useI18n();
  const store = useStore();
  const status = computed<StatusValue>(() => store.getters['Domain/getStatus']('currentDomainFunctionalities'));
  const functionalities = computed<Functionality[]>(() => store.getters['Domain/getAllFunctionalities']);
  const mainFunctionalities = computed<Functionality[]>(() => store.getters['Domain/getMainFunctionalities']);

  function getTranslatedText(functionality: Functionality, key: string): string {
    const i18nKey = `FUNCTIONALITIES.DETAILS.${functionality.identifier}.${key}`;
    const i18nValue = t(i18nKey);

    return i18nValue === i18nKey ? t(`FUNCTIONALITIES.DEFAULT.${key}`) : i18nValue;
  }

  async function saveFunctionality(functionality: Functionality) {
    try {
      await store.dispatch('Domain/updateDomainFunctionality', functionality);
      message.success(t('MESSAGES.UPDATE_SUCCESS'));
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
  }

  return {
    status,
    functionalities,
    mainFunctionalities,
    getTranslatedText,
    saveFunctionality,
  };
}
