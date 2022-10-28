<template>
  <div class="page-section">
    <ls-alert type="info" message="Hello there" closable></ls-alert>
    <ls-alert type="warning" message="Hello there"></ls-alert>
    <ls-alert type="success" message="Hello there"></ls-alert>
    <ls-alert type="error" message="Hello there"></ls-alert>
    <domain-quota
      :header-text="'Domain quota and used space'"
      :alert-text="'This section allows you manage the current domain quota size and setup it as on your need'"
      :used-space="10000"
      :remaining-quota="50000"
      :sub-quota="30000"
      :unallocated-space="10000"
      :maximim-quota="'10 TB'"
      :note="'0.00/1 TB already used (0.08%)'"
      :label="'Domain Quota'"
    ></domain-quota>
  </div>
</template>
<script lang="ts" setup>
import LsAlert from '@/core/components/ls/ls-alert.vue';
import DomainQuota from '../../quota/domain-quota.vue';
</script>
<style>
.page-section {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 12px;
}
</style>

headerText?: string; alertText?: string; usedSpace?: number; remainingQuota?: number; unallocatedSpace?: number;
subQuota?: number; maximimQuota?: string; note?: string; label?: string;
