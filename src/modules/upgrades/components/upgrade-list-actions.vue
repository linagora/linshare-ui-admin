<template>
  <div class="upgrade-list-actions">
    <a-input
      v-model:value="filterText"
      :placeholder="$t('UPGRADE_TASK.SEARCH')"
      class="upgrade-list-actions__action-input"
    >
      <template #prefix>
        <SearchOutlined />
      </template>
    </a-input>
    <a-button class="ls-button ls-refresh" @click="emits('refresh')">
      <a-spin v-if="loading" />
      <div v-else>
        <ReloadOutlined />
        {{ $t('GENERAL.REFRESH') }}
      </div>
    </a-button>
  </div>
</template>
<script lang="ts" setup>
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons-vue';
import useUpgradeTasks from '../hooks/useUpgradeTasks';

defineProps<{
  loading: boolean;
}>();
const { filterText } = useUpgradeTasks();
// props & emits
const emits = defineEmits(['refresh']);
</script>
<style lang="less">
.upgrade-list-actions {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 12px;

  &__action-input {
    background: #fafafa;
    border: 1px solid #e4e5f0;
    border-radius: 10px;
    height: 44px;
    width: 400px;
    input {
      background-color: transparent;
    }
  }

  .ls-refresh {
    min-width: 130px;
    color: @primary-color;
  }
}
</style>
