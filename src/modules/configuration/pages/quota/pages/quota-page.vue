<template>
  <div :key="data.key" class="quota-page">
    <div class="quota-page__tabs">
      <domain-quota
        :header-text="'Domain quota and used space'"
        :alert-text="'This section allows you manage the current domain quota size and setup it as on your need'"
        :used-space="domainQuotaInformations.usedSpace"
        :remaining-quota="domainQuotaInformations.currentValueForSubdomains"
        :sub-quota="domainQuotaInformations.currentValueForSubdomains"
        :unallocated-space="domainQuotaInformations.quota - domainQuotaInformations.usedSpace"
        :maximim-quota="domainQuotaInformations.quota"
        :note="`${niceBytes(domainQuotaInformations.usedSpace)}/${niceBytes(
          domainQuotaInformations.quota
        )} already used (${((domainQuotaInformations.usedSpace / domainQuotaInformations.quota) * 100).toFixed(1)}%)`"
        :label="'Domain Quota'"
        :maintenance="domainQuotaInformations.maintenance"
        @maintenance="switchMaintenance"
      >
      </domain-quota>
    </div>
  </div>
</template>
<script lang="ts" setup>
import DomainQuota from '../components/domain-quota.vue';
import { reactive, watch } from 'vue';
import useQuota from '../hooks/useQuota';
import { storeToRefs } from 'pinia';
import { useDomainStore } from '@/modules/domain/store';
import { useRouter } from 'vue-router';

const domainStore = useDomainStore();
const { currentDomain } = storeToRefs(domainStore);
const { niceBytes, switchMaintenance, domainQuotaInformations, getInformations } = useQuota();
const { currentRoute } = useRouter();
const data = reactive({
  key: 0,
});

watch(currentRoute, (newRoute) => {
  if (newRoute) {
    data.key += 1;
  }
});

getInformations(currentDomain.value.uuid);
</script>
