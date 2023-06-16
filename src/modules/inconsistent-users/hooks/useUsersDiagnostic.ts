import { reactive, ref, computed, watch } from 'vue';
import { DEFAULT_PAGE_SIZE } from '@/core/constants';
import { UserDiagnostic } from '../types/UserDiagnotic';
import { message } from 'ant-design-vue';
import { APIError } from '@/core/types/APIError';
import { useI18n } from 'vue-i18n';
import { userCheck } from '../services/inconsistent-users-api';

const list = ref<UserDiagnostic[]>([]);
const filterText = reactive({
  mail: '',
});
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: DEFAULT_PAGE_SIZE,
});
const loading = ref(false);

const filteredList = computed(() => {
  return list.value.filter((user) => {
    const mailMatch =
      filterText.mail !== '' && filterText.mail !== undefined
        ? user.userMail.toLowerCase().includes(filterText.mail.toLowerCase())
        : true;

    return mailMatch;
  });
});

const filteredListByPage = computed(() => {
  const firstIndex = (pagination.current - 1) * pagination.pageSize;
  const lastIndex = pagination.current * pagination.pageSize;
  return filteredList.value.slice(firstIndex, lastIndex);
});

export default function useUsersDiagnostic() {
  const { t } = useI18n();

  watch(filteredList, async (newVal) => {
    pagination.total = newVal.length;
  });

  async function getUserInformations(userMail: string) {
    loading.value = true;
    try {
      const datas = await userCheck(userMail);
      list.value = datas;
      loading.value = false;
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
  }

  function resetFilters() {
    filterText.mail = '';
  }

  function handleTableChange(userMail: string) {
    getUserInformations(userMail);
  }

  return {
    getUserInformations,
    list,
    loading,
    resetFilters,
    pagination,
    filterText,
    filteredList,
    filteredListByPage,
    handleTableChange,
  };
}
