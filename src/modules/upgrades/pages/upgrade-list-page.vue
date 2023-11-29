<template>
  <div class="upgrade-list-page">
    <a-alert class="upgrade-list-page__help-text">
      <template #description>
        <ul>
          <li>
            <strong>{{ $t('UPGRADE_TASK.UTILITY') }}</strong>
            <p>{{ $t('UPGRADE_TASK.UTILITY_CONTENT') }}</p>
          </li>
          <li>
            <strong>{{ $t('UPGRADE_TASK.PROCESS') }}</strong>
            <p>{{ $t('UPGRADE_TASK.PROCESS_CONTENT') }}</p>
          </li>
          <li>
            <strong>{{ $t('UPGRADE_TASK.CRITICALITY') }}</strong>
            <p>{{ $t('UPGRADE_TASK.CRITICALITY_CONTENT') }}</p>
          </li>
        </ul>
      </template>
    </a-alert>
    <div>
      <upgrade-list-table />
      <ThePagination v-model="pagination" class="pagination" :is-visible="!!filteredList.length" />
    </div>
  </div>

  <a-modal
    v-model:visible="upgradeTaskRetryModal.visible"
    :closable="false"
    :footer="null"
    class="upgrade-list-page__modal"
  >
    <retryUpgradeTask @close="onCloseUpgradeTaskRetryModal"></retryUpgradeTask>
  </a-modal>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue';
import ThePagination from '@/core/components/the-pagination.vue';
import useUpgradeTasks from '@/modules/upgrades/hooks/useUpgradeTasks';
import UpgradeListTable from '@/modules/upgrades/components/upgrade-list-table.vue';
import retryUpgradeTask from '../components/retry-upgrade-task-card.vue';

const { pagination, filteredList, fetchUpgradeTask, upgradeTaskRetryModal, onCloseUpgradeTaskRetryModal } =
  useUpgradeTasks();

onMounted(() => {
  fetchUpgradeTask();
});
</script>

<style lang="less">
.upgrade-list-page {
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

  &__action {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
  }

  &__action-input {
    width: 375px;
  }

  &__action-switch {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    white-space: nowrap;
    gap: 4px;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: -0.02em;
    color: #434657;
  }

  &__modal .ant-modal-content {
    background: #ffffff;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.08), 0px 8px 8px rgba(0, 0, 0, 0.16);
    border-radius: 16px;
    overflow: hidden;
  }

  &__modal .ant-modal-body {
    padding: 0;
  }
}

.ls-detail {
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f2f8ff;
  border: 1px solid #a3dcff;
  color: #007aff;
  border-radius: 7px;
  transform: rotate(90deg);
}
</style>
