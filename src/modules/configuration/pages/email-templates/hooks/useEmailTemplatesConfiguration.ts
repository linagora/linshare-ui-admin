import { reactive, ref, computed, watch } from 'vue';
import { DEFAULT_PAGE_SIZE } from '@/core/constants';
import { MailConfiguration } from '../types/MailConfiguration';
import { message } from 'ant-design-vue';
import { APIError } from '@/core/types/APIError';
import { STATUS } from '@/core/types/Status';
import { getMailConfigurationList } from '../services/email-templates-api';
import { storeToRefs } from 'pinia';
import { useDomainStore } from '@/modules/domain/store';

const list = ref<MailConfiguration[]>([]);
const filterText = ref('');
const status = ref(STATUS.LOADING);
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: DEFAULT_PAGE_SIZE,
});

const filteredList = computed(() =>
  list.value.filter((mailConfig) => mailConfig.name.toLowerCase().includes(filterText.value.toLowerCase()))
);
const filteredListByPage = computed(() => {
  const firstIndex = (pagination.current - 1) * pagination.pageSize;
  const lastIndex = pagination.current * pagination.pageSize;
  return filteredList.value.slice(firstIndex, lastIndex);
});

export default function useEmailTemplatesConfiguration() {
  const { currentDomain } = storeToRefs(useDomainStore());

  watch(filteredList, async (newVal) => {
    pagination.total = newVal.length;
  });

  async function fetchMailConfiguration() {
    status.value = STATUS.LOADING;
    try {
      const messages = await getMailConfigurationList(currentDomain.value.uuid, false);
      status.value = STATUS.SUCCESS;
      list.value = messages;
    } catch (error) {
      status.value = STATUS.ERROR;

      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
  }

  function isAssigned(MailConfigurationUuid: string, currentDomainMailConfigurationUuid: string | undefined) {
    if (MailConfigurationUuid === currentDomainMailConfigurationUuid) {
      return true;
    }
    return false;
  }

  return {
    list,
    fetchMailConfiguration,
    status,
    isAssigned,
    pagination,
    filterText,
    filteredList,
    filteredListByPage,
  };
}
