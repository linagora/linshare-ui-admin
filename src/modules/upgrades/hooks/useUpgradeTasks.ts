import { reactive, ref, computed, watch } from 'vue';
import { DEFAULT_PAGE_SIZE } from '@/core/constants';
import { UpgradeTask } from '../types/UpgradeTask';
import { message } from 'ant-design-vue';
import { APIError } from '@/core/types/APIError';
import { STATUS } from '@/core/types/Status';
import { useI18n } from 'vue-i18n';
import { useLocalStorage } from '@vueuse/core';
import { useRouter } from 'vue-router';
import {
  getConsoleInformations,
  upgradeTaskRetry,
  getUpgradeTaskList,
  getUpgradeTaskDetail,
  upgradeTaskinformations,
} from '../services/upgrade-task-api';
import { ConsoleInfos } from '../types/UpgradeTask';
import { UPGRADES_TEMPLATES_ROUTE_NAMES } from '../router';

const activeUpgradeTask = useLocalStorage<UpgradeTask>('upgrade-task', {} as UpgradeTask);

const list = ref<UpgradeTask[]>([]);
const logEntries = ref<ConsoleInfos[]>([]);
const filterText = ref('');
const status = ref(STATUS.LOADING);
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: DEFAULT_PAGE_SIZE,
});
const loading = ref(false);

const upgradeTaskRetryModal = reactive<{
  visible: boolean;
  taskToReloadIdentifier: string;
  taskToReloadUuid: string;
}>({
  visible: false,
  taskToReloadIdentifier: '',
  taskToReloadUuid: '',
});

function onCloseUpgradeTaskRetryModal() {
  upgradeTaskRetryModal.visible = false;
}

function openUpgradeTaskRetryModal(taskIdentifier: string) {
  upgradeTaskRetryModal.visible = true;
  upgradeTaskRetryModal.taskToReloadIdentifier = taskIdentifier;
}

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

export default function useUpgradeTask() {
  // composable
  const { t } = useI18n();
  const router = useRouter();

  async function fetchUpgradeTask() {
    loading.value = true;
    try {
      const policies = await getUpgradeTaskList();
      list.value = policies || [];
    } catch (error) {
      status.value = STATUS.ERROR;
    } finally {
      loading.value = false;
    }
  }

  async function upgradeTaskConsoleInformations(identifier: string | string[], uuid: string | string[]) {
    try {
      loading.value = true;
      let status = await upgradeTaskinformations(identifier);
      while (status.status !== 'SUCCESS') {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        status = await upgradeTaskinformations(identifier);
      }
      logEntries.value = await getConsoleInformations(identifier, uuid);
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    } finally {
      loading.value = false;
    }
  }

  async function onConfirmRetryUpgradeTask(identifier: string) {
    try {
      loading.value = true;
      const newTaskInfo = await upgradeTaskRetry(identifier);
      upgradeTaskRetryModal.taskToReloadUuid = newTaskInfo.asyncTaskUuid;
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    } finally {
      router.push({
        name: UPGRADES_TEMPLATES_ROUTE_NAMES.UPGRADES_DETAIL_CONSOLE,
        params: { identifier: identifier, id: upgradeTaskRetryModal.taskToReloadUuid },
      });
      loading.value = false;
    }
  }

  watch(filteredList, async (newVal) => {
    pagination.total = newVal.length;
    pagination.current =
      pagination.current * pagination.pageSize > pagination.total
        ? Math.ceil(pagination.total / pagination.pageSize) || 1
        : pagination.current;
  });

  async function fetchUpgradeTaskDetail(uuid: string) {
    loading.value = true;
    try {
      const asyncTasks = await getUpgradeTaskDetail(uuid);
      status.value = STATUS.SUCCESS;
      return asyncTasks || [];
    } catch (error) {
      status.value = STATUS.ERROR;

      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
      return [];
    } finally {
      loading.value = false;
    }
  }

  function onShowPreviewExecuse(item: UpgradeTask) {
    activeUpgradeTask.value = item;
    router.push({ name: UPGRADES_TEMPLATES_ROUTE_NAMES.UPGRADES_DETAIL, params: { id: item.identifier } });
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
    logEntries,
    upgradeTaskConsoleInformations,
    onCloseUpgradeTaskRetryModal,
    upgradeTaskRetryModal,
    openUpgradeTaskRetryModal,
    onConfirmRetryUpgradeTask,
    fetchUpgradeTaskDetail,
    onShowPreviewExecuse,
  };
}
