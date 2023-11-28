<template>
  <div class="upgrade-task-console">
    <a-alert class="upgrade-task-console__help-text" closable>
      <template #description>
        <div class="helper-text-infos">
          <span> {{ $t('UPGRADE_TASK.UPGRADE_CONSOLE.HELPER_TEXT_P1') }}</span>
          <span> {{ $t('UPGRADE_TASK.UPGRADE_CONSOLE.HELPER_TEXT_P2') }}</span>
          <span> {{ $t('UPGRADE_TASK.UPGRADE_CONSOLE.HELPER_TEXT_P3') }}</span>
        </div>
      </template>
    </a-alert>
  </div>
  <div class="filter-switch">
    <span>{{ $t('UPGRADE_TASK.UPGRADE_CONSOLE.SWITCH_TITLE') }}</span>
    <div class="log-filters-options">
      <span>{{ $t('UPGRADE_TASK.UPGRADE_CONSOLE.WARNING') }}</span>
      <a-switch v-model:checked="showWarning" class="log-filters-options__switch" />
    </div>
    <div class="log-filters-options">
      <span>{{ $t('UPGRADE_TASK.UPGRADE_CONSOLE.INFO') }}</span>
      <a-switch v-model:checked="showInfo" class="log-filters-options__switch" />
    </div>
    <div class="log-filters-options">
      <span>{{ $t('UPGRADE_TASK.UPGRADE_CONSOLE.ERROR') }}</span>
      <a-switch v-model:checked="showError" class="log-filters-options__switch" />
    </div>
    <div class="log-filters-options">
      <span>{{ $t('UPGRADE_TASK.UPGRADE_CONSOLE.DEBUG') }}</span>
      <a-switch v-model:checked="showDebug" class="log-filters-options__switch" />
    </div>
  </div>
  <div class="console">
    <div v-if="!loading">
      <div v-for="logEntry in filteredLogEntries" :key="logEntry.creationDate">
        <div class="log-entry">
          <span class="date">{{ $d(logEntry.creationDate, 'customDateTime') }}</span>
          <span class="criticity">{{ logEntry.criticity }}</span>
          <span class="message">{{ logEntry.message }}</span>
        </div>
      </div>
    </div>
    <a-spin v-else class="custom-spin" />
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, onBeforeUnmount, onMounted } from 'vue';
import useUpgradeTask from '../hooks/useUpgradeTasks';
import { useRoute } from 'vue-router';
import useUpgradeTaskPage from '@/core/hooks/useUpgradeTaskPage';
import ReloadIcon from '@/core/components/icons/reload-icon.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { upgradeTaskConsoleInformations, logEntries, loading } = useUpgradeTask();
const { setActions } = useUpgradeTaskPage();
const route = useRoute();
const showWarning = ref(true);
const showInfo = ref(true);
const showError = ref(true);
const showDebug = ref(false);

const filteredLogEntries = computed(() => {
  if (!Array.isArray(logEntries.value)) {
    return [];
  }
  return logEntries.value.filter((logEntry) => {
    switch (logEntry.criticity) {
      case 'WARNING':
        return showWarning.value;
      case 'INFO':
        return showInfo.value;
      case 'ERROR':
        return showError.value;
      case 'DEBUG':
        return showDebug.value;
      default:
        return true;
    }
  });
});

upgradeTaskConsoleInformations(route.params.identifier, route.params.id);

onMounted(() => {
  setActions([
    {
      label: t('UPGRADE_TASK.UPGRADE_CONSOLE.RELOAD'),
      class: 'ls-reload',
      icon: ReloadIcon,
      action: () => {
        upgradeTaskConsoleInformations(route.params.identifier, route.params.id);
      },
    },
  ]);
});
onBeforeUnmount(() => {
  setActions([]);
});
</script>
<style lang="less">
.upgrade-task-console {
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
  }
}
.helper-text-infos {
  display: flex;
  flex-direction: column;
  span:last-child {
    margin-top: 5px;
    font-weight: bolder;
  }
}

.filter-switch {
  display: flex;
  flex-direction: row;
  color: #343745;
  font-weight: 400;
}

.log-filters-options {
  margin-left: 10px;

  &__switch {
    margin-left: 5px;
  }
}

.console {
  height: 700px;
  overflow: auto;
  border-radius: 16px;
  background-color: #1e1e1e;
  padding: 32px;
}

.log-entry {
  display: grid;
  grid-template-columns: minmax(150px, min-content) minmax(100px, min-content) 2fr;
  grid-column-gap: 15px;
  margin-bottom: 8px;
}

.date {
  font-size: 18px;
  font-weight: 700;
  line-height: 18px;
  letter-spacing: -0.01em;
  text-align: left;
  color: #7d7d7d;
  margin-right: 15px;
  white-space: nowrap;
}

.message {
  color: #ffffff;
  font-size: 18px;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: -0.01em;
  text-align: left;
  flex-grow: 1;
}

.criticity {
  color: #ffe040;
  font-size: 18px;
  font-weight: bold;
  line-height: 18px;
  letter-spacing: -0.01em;
  text-align: left;
  margin-right: 30px;
}

.custom-spin {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
}

.ls-reload {
  color: @primary-color;
}
</style>
