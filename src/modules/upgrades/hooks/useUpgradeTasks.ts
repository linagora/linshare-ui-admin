import { reactive, ref, computed, watch } from 'vue';
import { DEFAULT_PAGE_SIZE } from '@/core/constants';
import { UpgradeTask } from '../types/UpgradeTask';
import { message } from 'ant-design-vue';
import { APIError } from '@/core/types/APIError';
import { STATUS } from '@/core/types/Status';
import { useI18n } from 'vue-i18n';
import { getUpgradeTaskList } from '../services/upgrade-task-api';
import { useLocalStorage } from '@vueuse/core';
import { useRouter } from 'vue-router';

const activeUpgradeTask = useLocalStorage<UpgradeTask>('upgrade-task', {} as UpgradeTask);

const list = ref<UpgradeTask[]>([]);
const filterText = ref('');
const status = ref(STATUS.LOADING);
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: DEFAULT_PAGE_SIZE,
});
const loading = ref(false);

const filteredList = computed(() =>
  list.value
    .filter(
      (upgradeTask: UpgradeTask) =>
        upgradeTask?.identifier?.toLowerCase().includes(filterText.value.toLowerCase()) ||
        upgradeTask?.parentIdentifier?.toLowerCase().includes(filterText.value.toLowerCase())
    )
    .sort((a: UpgradeTask, b: UpgradeTask) => (b.modificationDate || 0) - (a.modificationDate || 0))
);
const filteredListByPage = computed(() => {
  const firstIndex = (pagination.current - 1) * pagination.pageSize;
  const lastIndex = pagination.current * pagination.pageSize;
  return filteredList.value.slice(firstIndex, lastIndex);
});

export default function useDomainPolicies() {
  // composable
  const { t } = useI18n();
  const router = useRouter();

  watch(filteredList, async (newVal) => {
    pagination.total = newVal.length;
    pagination.current =
      pagination.current * pagination.pageSize > pagination.total
        ? Math.ceil(pagination.total / pagination.pageSize) || 1
        : pagination.current;
  });

  //methods

  async function fetchUpgradeTask() {
    loading.value = true;
    try {
      const policies = await getUpgradeTaskList();
      list.value = policies || [];
    } catch (error) {
      status.value = STATUS.ERROR;

      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    } finally {
      loading.value = false;
    }
  }

  return {
    list,
    status,
    loading,
    pagination,
    filterText,
    filteredList,
    activeUpgradeTask,
    filteredListByPage,
    fetchUpgradeTask,
  };
}
