import { reactive, ref, computed, watch } from 'vue';
import { DEFAULT_PAGE_SIZE } from '@/core/constants';
import { message } from 'ant-design-vue';
import { APIError } from '@/core/types/APIError';
import { getMimiPolicies } from '../services/mime-policies-api';
import MimePolicies from '../types/MimeType';
import { STATUS } from '@/core/types/Status';

const list = ref<MimePolicies[]>([]);
const filterText = ref('');
const status = ref(STATUS.LOADING);
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: DEFAULT_PAGE_SIZE,
});

const filteredList = computed(() =>
  list.value.filter(
    (mime) =>
      mime.name.toLowerCase().includes(filterText.value.toLowerCase()) ||
      mime.domainName.toLowerCase().includes(filterText.value.toLowerCase())
  )
);
const filteredListByPage = computed(() => {
  const firstIndex = (pagination.current - 1) * pagination.pageSize;
  const lastIndex = pagination.current * pagination.pageSize;
  return filteredList.value.slice(firstIndex, lastIndex);
});

export default function useMimesPolicies() {
  watch(filteredList, async (newVal) => {
    pagination.total = newVal.length;
  });

  async function getMinePoliciesList(domainUuid: string) {
    status.value = STATUS.LOADING;
    try {
      const mimes = await getMimiPolicies(domainUuid, false);
      list.value = mimes;
      status.value = STATUS.SUCCESS;
      return;
    } catch (error) {
      status.value = STATUS.ERROR;
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
  }

  function isAssigned(MimeTypeUuid: string, currentDomainMimeTypeUuid: string | undefined) {
    if (MimeTypeUuid === currentDomainMimeTypeUuid) {
      return true;
    }
    return false;
  }

  function isEditable(domainUuid: string, currentDomainUuid: string | undefined) {
    if (domainUuid !== currentDomainUuid) {
      return true;
    }
    return false;
  }

  return {
    getMinePoliciesList,
    list,
    status,
    filteredListByPage,
    filterText,
    isAssigned,
    isEditable,
    filteredList,
    pagination,
  };
}
