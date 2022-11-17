<template>
  <div class="quota-page">
    <div class="quota-page__tabs">
      <configuration-tabs>test </configuration-tabs>
      <domain-quota
        :header-text="'Domain quota and used space'"
        :alert-text="'This section allows you manage the current domain quota size and setup it as on your need'"
        :used-space="domainQuotaInformations.usedSpace"
        :remaining-quota="domainQuotaInformations.currentValueForSubdomains"
        :sub-quota="domainQuotaInformations.currentValueForSubdomains"
        :unallocated-space="domainQuotaInformations.quota - domainQuotaInformations.usedSpace"
        :maximim-quota="domainQuotaInformations.quota"
        :note="`${usedSpaceNoteInformation(domainQuotaInformations.usedSpace)}/${niceBytes(
          domainQuotaInformations.quota
        )} already used (${(domainQuotaInformations.usedSpace / domainQuotaInformations.quota) * 100}%)`"
        :label="'Domain Quota'"
        :maintenance="domainQuotaInformations.maintenance"
        @maintenance="switchMaintenance"
      >
      </domain-quota>
    </div>
  </div>
</template>
<script lang="ts" setup>
import configurationTabs from '@/core/components/configuration-tabs.vue';
import DomainQuota from '../../quota/domain-quota.vue';
import useQuota from '../hooks/useQuota';
import { storeToRefs } from 'pinia';
import { useDomainStore } from '@/modules/domain/store';

const domainStore = useDomainStore();
const { currentDomain } = storeToRefs(domainStore);
const { niceBytes, switchMaintenance, domainQuotaInformations, getInformations, usedSpaceNoteInformation } = useQuota();

getInformations(currentDomain.value.uuid);
</script>
