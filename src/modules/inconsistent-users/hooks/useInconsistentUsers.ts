import { reactive, ref, computed, watch } from 'vue';
import { DEFAULT_PAGE_SIZE } from '@/core/constants';
import { InconsistentUsers } from '../types/InconsistentUsers';
import { message } from 'ant-design-vue';
import { APIError } from '@/core/types/APIError';
import { STATUS } from '@/core/types/Status';
import { useI18n } from 'vue-i18n';
import { getInconsistentUsersList } from '../services/inconsistent-users-api';
import { storeToRefs } from 'pinia';

const list = ref<InconsistentUsers[]>([]);
const filterText = ref('');
const status = ref(STATUS.LOADING);
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: DEFAULT_PAGE_SIZE,
});

const filteredList = computed(() =>
  list.value.filter((inconsistentUser) =>
    inconsistentUser.lastName.toLowerCase().includes(filterText.value.toLowerCase())
  )
);
const filteredListByPage = computed(() => {
  const firstIndex = (pagination.current - 1) * pagination.pageSize;
  const lastIndex = pagination.current * pagination.pageSize;
  return filteredList.value.slice(firstIndex, lastIndex);
});

export default function useInconsistentUsers() {
  const { t } = useI18n();

  watch(filteredList, async (newVal) => {
    pagination.total = newVal.length;
  });

  async function fetchInconsistentUsersList() {
    status.value = STATUS.LOADING;
    try {
      const datas = await getInconsistentUsersList();
      status.value = STATUS.SUCCESS;
      list.value = datas;
    } catch (error) {
      status.value = STATUS.ERROR;

      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
  }

  return {
    useInconsistentUsers,
    fetchInconsistentUsersList,
    list,
    status,
    pagination,
    filterText,
    filteredList,
    filteredListByPage,
  };
}
