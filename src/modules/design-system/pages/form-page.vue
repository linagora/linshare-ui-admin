<template>
  <div class="design-form-page">
    <ls-quota-input
      v-model:model-value="form.quotaValue"
      v-model:model-unit="form.unit"
      label="Hello world"
    ></ls-quota-input>
    <ls-domain-treeview :node="domains" :is-root="true" :level="1"></ls-domain-treeview>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import LsQuotaInput from '@/core/components/ls/ls-quota-input.vue';
import LsDomainTreeview from '@/core/components/ls/ls-domain-treeview.vue';
import DomainTreeNode from '@/modules/domain/types/DomainTreeNode';

const domains: DomainTreeNode = {
  name: 'Root domain',
  checked: false,
  uuid: 'sgsdg-gsdh-hsd-hsdh',
  children: [
    {
      name: 'Top domain',
      checked: false,
      uuid: 'sgsdg-gsdh-hsd-hsdh1',
      children: [
        {
          name: 'Sub domain 01',
          checked: false,
          uuid: 'sgsdg-gsdh-hsd-hsdh2',
          children: [
            {
              name: 'Sub Sub domain 01',
              checked: false,
              uuid: 'sgsdg-gsdh-hsd-hsdh3',
            },
            {
              name: 'Sub Sub domain 02',
              checked: false,
              uuid: 'sgsdg-gsdh-hsd-hsdh4',
            },
            {
              name: 'Sub Sub domain 03',
              checked: false,
              uuid: 'sgsdg-gsdh-hsd-hsdh5',
            },
            {
              name: 'Sub Sub domain 04',
              checked: false,
              uuid: 'sgsdg-gsdh-hsd-hsdh6',
            },
          ],
        },
        {
          name: 'Sub domain 02',
          checked: false,
          uuid: 'sgsdg-gsdh-hsd-hsdh7',
        },
        {
          name: 'Sub domain 03',
          checked: false,
          uuid: 'sgsdg-gsdh-hsd-hsdh8',
        },
        {
          name: 'Sub domain 04',
          checked: false,
          uuid: 'sgsdg-gsdh-hsd-hsdh9',
          children: [
            {
              name: 'Sub Sub domain 01',
              checked: false,
              uuid: 'sgsdg-gsdh-hsd-hsdh10',
            },
            {
              name: 'Sub Sub domain 02',
              checked: false,
              uuid: 'sgsdg-gsdh-hsd-hsdh11',
            },
            {
              name: 'Sub Sub domain 03',
              checked: false,
              uuid: 'sgsdg-gsdh-hsd-hsdh12',
            },
            {
              name: 'Sub Sub domain 04',
              checked: false,
              uuid: 'sgsdg-gsdh-hsd-hsdh13',
            },
          ],
        },
      ],
    },
  ],
};
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
