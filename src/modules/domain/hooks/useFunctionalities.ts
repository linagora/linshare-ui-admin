import { computed, ComputedRef, Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDomainStore } from '@/modules/domain/store';
import { message } from 'ant-design-vue';
import { Functionality } from '@/core/types/Functionality';
import { APIError } from '@/core/types/APIError';
import StatusValue from '@/core/types/Status';
import { storeToRefs } from 'pinia';

type UsableFunctionalities = {
  status: ComputedRef<StatusValue>;
  functionalities: Ref<Functionality[]>;
  mainFunctionalities: ComputedRef<Functionality[]>;
  getTranslatedText: (functionality: Functionality, key: string) => string;
  saveFunctionality: (functionality: Functionality) => Promise<void>;
};

export default function useFunctionalities(): UsableFunctionalities {
  const { t } = useI18n();
  const domainStore = useDomainStore();
  const status = computed<StatusValue>(() => domainStore.getStatus('currentDomainFunctionalities'));
  const { currentDomainFunctionalities } = storeToRefs(domainStore);
  const mainFunctionalities = computed<Functionality[]>(() => domainStore.getMainFunctionalities);

  function getTranslatedText(functionality: Functionality, key: string): string {
    const i18nKey = `FUNCTIONALITIES.DETAILS.${functionality.identifier}.${key}`;
    const i18nValue = t(i18nKey);

    return i18nValue === i18nKey ? t(`FUNCTIONALITIES.DEFAULT.${key}`) : i18nValue;
  }

  async function saveFunctionality(functionality: Functionality) {
    try {
      await domainStore.updateDomainFunctionality(functionality);
      message.success(t('MESSAGES.UPDATE_SUCCESS'));
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
  }

  return {
    status,
    mainFunctionalities,
    getTranslatedText,
    saveFunctionality,
    functionalities: currentDomainFunctionalities,
  };
}
