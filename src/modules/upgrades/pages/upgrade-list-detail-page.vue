<template>
  <div class="upgrade-list-detail-page">
    <a-alert class="upgrade-list-detail-page__help-text">
      <template #description>
        <ul>
          <li>
            <strong>{{ $t('UPGRADE_TASK.DETAIL.NOTE_TITLE') }}</strong>
            <p v-html="$t('UPGRADE_TASK.DETAIL.NOTE_CONTENT')"></p>
          </li>
        </ul>
      </template>
    </a-alert>
    <async-task-table :loading="loading" :tasks="filteredListByPage" />
    <ThePagination v-model="pagination" class="pagination" :is-visible="!!asyncTasks.length" />
  </div>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { DEFAULT_PAGE_SIZE } from '@/core/constants';
import { AsyncTask } from '@/modules/upgrades/types/UpgradeTask';
import ThePagination from '@/core/components/the-pagination.vue';
import useUpgradeTaskPage from '@/core/hooks/useUpgradeTaskPage';
import ReloadIcon from '@/core/components/icons/reload-icon.vue';
import useUpgradeTasks from '@/modules/upgrades/hooks/useUpgradeTasks';
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import AsyncTaskTable from '@/modules/upgrades/components/async-task-table.vue';

const { t } = useI18n();
const route = useRoute();
const { setActions } = useUpgradeTaskPage();
const { loading, fetchUpgradeTaskDetail } = useUpgradeTasks();

const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: DEFAULT_PAGE_SIZE,
});

const asyncTasks = ref([]);

const filteredList = computed(() => {
  return [...asyncTasks.value].sort(
    (a: AsyncTask, b: AsyncTask) => (b.modificationDate || 0) - (a.modificationDate || 0)
  );
});
const filteredListByPage = computed(() => {
  const firstIndex = (pagination.current - 1) * pagination.pageSize;
  const lastIndex = pagination.current * pagination.pageSize;
  return filteredList.value.slice(firstIndex, lastIndex);
});

async function onFetchingData() {
  const uuid = route.params.id;
  asyncTasks.value = await fetchUpgradeTaskDetail(uuid?.toString() || '');
}

watch(filteredList, async (newVal) => {
  pagination.total = newVal.length;
  pagination.current =
    pagination.current * pagination.pageSize > pagination.total
      ? Math.ceil(pagination.total / pagination.pageSize) || 1
      : pagination.current;
});

onMounted(() => {
  setActions([
    {
      label: t('GENERAL.REFRESH'),
      class: 'ls-reload',
      icon: ReloadIcon,
      loading: loading,
      action: () => {
        onFetchingData();
      },
    },
  ]);
  onFetchingData();
});

onBeforeUnmount(() => {
  setActions([]);
});
</script>
<style lang="less">
.upgrade-list-detail-page {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 16px;

  &__help-text {
    padding: 12px 24px 12px 16px;
    gap: 6px;
    width: 100%;
    background: #f2f8ff;
    border-radius: 8px;
    border: none;
    color: #007aff;
    display: inline-block;
  }
}
.ls-reload {
  color: @primary-color;
}
</style>
