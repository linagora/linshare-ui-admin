<template>
  <a-card flat :bordered="false" class="retry-upgrade-task-card">
    <div class="retry-upgrade-task-card__icon">
      <ReplayIcon width="52" height="30" />
    </div>
    <div class="retry-upgrade-task-card__content">
      <strong>{{ $t('UPGRADE_TASK.RETRY_MODAL.TITLE') }}</strong>
      <span>{{ $t('UPGRADE_TASK.RETRY_MODAL.DESCRIPTION') }}</span>
    </div>
    <div class="retry-upgrade-task-card__actions">
      <a-button class="ls-button ls-cancel" type="primary" @click="onCloseModal">{{ $t('GENERAL.CANCEL') }}</a-button>
      <a-button class="ls-button ls-confirm" type="primary" info @click="ConfirmRetryUpgradeTask">
        <a-spin v-if="loading" />
        <span v-else>{{ $t('UPGRADE_TASK.RETRY_MODAL.ACTION') }}</span>
      </a-button>
    </div>
  </a-card>
</template>
<script lang="ts" setup>
import ReplayIcon from '@/core/components/icons/replay-icon.vue';
import useUpgradeTasks from '@/modules/upgrades/hooks/useUpgradeTasks';

const { onConfirmRetryUpgradeTask, loading, upgradeTaskRetryModal } = useUpgradeTasks();

const emits = defineEmits(['close']);

function onCloseModal() {
  emits('close');
}
async function ConfirmRetryUpgradeTask() {
  onConfirmRetryUpgradeTask(upgradeTaskRetryModal.taskToReloadIdentifier);
  emits('close');
}
</script>
<style lang="less" scoped>
.retry-upgrade-task-card {
  .ant-card-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    border: none;
  }

  &__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 24px;

    strong {
      font-weight: 600;
      font-size: 20px;
      line-height: 24px;
      text-align: center;
      color: #434657;
    }

    span {
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      text-align: center;
      letter-spacing: -0.01em;
      color: #6d7885;
    }
  }

  &__icon {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #007aff;
    width: 68px;
    height: 68px;
    background: #e8f4ff;
    border-radius: 16px;
    margin: 0 auto;
    margin-bottom: 24px;
  }

  &__icon svg {
    width: 100%;
    height: auto;
  }

  &__actions {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 12px;

    .ls-button {
      flex-grow: 1;
    }

    .ls-cancel,
    .ls-cancel:hover {
      background-color: #f3f3f7;
      color: #007aff;
      border-color: #f3f3f7;
    }

    .ls-confirm {
      background-color: red;
      border-color: #f3f3f7;
    }
  }
}
</style>
