<template>
  <div :key="data.key" class="quota-page">
    <div class="quota-page__tabs">
      <domain-quota
        :header-text="$t('QUOTA.QUOTA_AND_USED_SPACE')"
        :alert-text="$t('QUOTA.QUOTA_AND_USED_INFORMATIONS_ALERT')"
        :used-space="domainQuotaInformations.usedSpace"
        :remaining-quota="domainQuotaInformations.currentValueForSubdomains"
        :sub-quota="domainQuotaInformations.currentValueForSubdomains"
        :unallocated-space="domainQuotaInformations.quota - domainQuotaInformations.usedSpace"
        :maximim-quota="domainQuotaInformations.quota"
        :note="`${niceBytes(domainQuotaInformations.usedSpace)}/${niceBytes(domainQuotaInformations.quota)} ${$t(
          'QUOTA.ALREADY_USED'
        )} (${((domainQuotaInformations.usedSpace / domainQuotaInformations.quota) * 100).toFixed(1)}%)`"
        :label="$t('QUOTA.DOMAIN_QUOTA')"
        :maintenance="domainQuotaInformations.maintenance"
        :default-quota="domainQuotaInformations.defaultQuota"
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
import { useI18n } from 'vue-i18n';

const domainStore = useDomainStore();
const { currentDomain } = storeToRefs(domainStore);
const { niceBytes, switchMaintenance, domainQuotaInformations, getInformations } = useQuota();
const { currentRoute } = useRouter();
const { t } = useI18n();
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
