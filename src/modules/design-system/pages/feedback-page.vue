<template>
  <div class="page-section">
    <ls-alert type="info" message="Hello there" closable></ls-alert>
    <ls-alert type="warning" message="Hello there"></ls-alert>
    <ls-alert type="success" message="Hello there"></ls-alert>
    <ls-alert type="error" message="Hello there"></ls-alert>
    <quota :used-space="1000" :remaining-quota="2000" :unallocated-space="3000" :sub-quota="0"></quota>
  </div>
</template>
<script lang="ts" setup>
import LsAlert from '@/core/components/ls/ls-alert.vue';
import Quota from '../../quota/components/quota-visualize.vue';
</script>
<style>
.page-section {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
