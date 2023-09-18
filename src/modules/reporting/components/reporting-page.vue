<script lang="ts" setup>
import { ref } from 'vue';
import ReportingStoragePage from './reporting-storage-page.vue';
import ReportingSharesPage from './reporting-shares-page.vue';

const activeKey = ref('1');
</script>
<template>
  <div class="tabs">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" :tab="$t('REPORTING.STORAGE_STATISTICS')"><ReportingStoragePage /></a-tab-pane>
      <a-tab-pane key="2" :tab="$t('REPORTING.SHARE_STATISTICS')"><ReportingSharesPage /></a-tab-pane>
    </a-tabs>
  </div>
</template>
<style lang="less" scoped>
.tabs {
  padding: 12px;
  background-color: whitesmoke;
  border-radius: 10px;
}
</style>
