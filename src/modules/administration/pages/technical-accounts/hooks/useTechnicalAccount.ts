import { reactive, ref, computed, watch } from 'vue';
import { DEFAULT_PAGE_SIZE } from '@/core/constants';
import { message } from 'ant-design-vue';
import { APIError } from '@/core/types/APIError';
import { getTechnicalAccountsList } from '../services/technical-account-api';
import { TechnicalAccount } from '../types/TechnicalAccount';

const list = ref<TechnicalAccount[]>([]);
const filterText = ref('');
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: DEFAULT_PAGE_SIZE,
});
const loading = ref(false);

export default function useTechnicalAccount() {
  async function fetchTechnicalUserList() {
    loading.value = true;
    try {
      const accounts = await getTechnicalAccountsList();
      list.value = accounts;
      loading.value = false;
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
  }

  const filteredList = computed(() =>
    list.value.filter((TechnicalAccountList: TechnicalAccount) =>
      TechnicalAccountList?.name?.toLowerCase().includes(filterText.value.toLowerCase())
    )
  );
  const filteredListByPage = computed(() => {
    const firstIndex = (pagination.current - 1) * pagination.pageSize;
    const lastIndex = pagination.current * pagination.pageSize;
    return filteredList.value.slice(firstIndex, lastIndex);
  });

  watch(filteredList, async (newVal) => {
    pagination.total = newVal.length;
  });

  fetchTechnicalUserList();

  return {
    list,
    loading,
    pagination,
    filterText,
    filteredList,
    filteredListByPage,
    fetchTechnicalUserList,
  };
}
