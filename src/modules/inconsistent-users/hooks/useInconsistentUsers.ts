import { reactive, ref, computed, watch } from 'vue';
import { DEFAULT_PAGE_SIZE } from '@/core/constants';
import { InconsistentUsers } from '../types/InconsistentUsers';
import { message } from 'ant-design-vue';
import { APIError } from '@/core/types/APIError';
import { STATUS } from '@/core/types/Status';
import { useI18n } from 'vue-i18n';
import { getInconsistentUsersList, migrateUser } from '../services/inconsistent-users-api';

const list = ref<InconsistentUsers[]>([]);
const filterText = ref('');
const status = ref(STATUS.LOADING);
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: DEFAULT_PAGE_SIZE,
});
const loading = ref(false);

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

  async function handleMigrateInconsistentUsers(payload: InconsistentUsers[], domain: string) {
    try {
      loading.value = true;

      const migratePromises = payload.map((item) => {
        item.domain = domain;

        return migrateUser(item);
      });
      if (!migratePromises) {
        return;
      }
      const responses = await Promise.all(migratePromises);

      if (responses) {
        message.success(t('MESSAGES.UPDATE_SUCCESS'));
        return true;
      }
      return false;
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
      return false;
    } finally {
      loading.value = false;
    }
  }

  return {
    useInconsistentUsers,
    fetchInconsistentUsersList,
    handleMigrateInconsistentUsers,
    list,
    status,
    loading,
    pagination,
    filterText,
    filteredList,
    filteredListByPage,
  };
}
