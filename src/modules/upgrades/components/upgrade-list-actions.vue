<template>
  <div class="upgrade-list-actions">
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
import { ReloadOutlined } from '@ant-design/icons-vue';

defineProps<{
  loading: boolean;
}>();
// props & emits
const emits = defineEmits(['refresh']);
</script>
<style lang="less">
.upgrade-list-actions {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;

  .ls-refresh {
    min-width: 130px;
  }
}
</style>
