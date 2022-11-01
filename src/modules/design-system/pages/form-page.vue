<template>
  <div class="design-form-page">
    <ls-quota-input
      v-model:model-value="form.quotaValue"
      v-model:model-unit="form.unit"
      label="Hello world"
    ></ls-quota-input>
    <ls-domain-treeview></ls-domain-treeview>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import LsQuotaInput from '@/core/components/ls/ls-quota-input.vue';
import LsDomainTreeview from '@/core/components/ls/ls-domain-treeview.vue';

const form = reactive({
  quotaValue: 0,
  unit: undefined,
});
</script>
<style>
.page-section {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
