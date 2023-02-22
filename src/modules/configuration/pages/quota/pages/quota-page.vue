<template>
  <div v-if="loading.page" class="spinner">
    <a-spin />
  </div>
  <div v-else class="quota-page">
    <div class="quota-page__tabs">
      <domain-quota-and-used-space> </domain-quota-and-used-space>
      <allocation-within-the-current-domain></allocation-within-the-current-domain>
      <subdomains-allocation-settings v-if="!isSubdomain()"></subdomains-allocation-settings>
    </div>
    <div class="quota-page__actions">
      <a-button
        v-if="form.saverCheck && currentDomain.type !== 'ROOTDOMAIN'"
        disabled
        type="primary"
        class="ls-button"
        >{{ $t('QUOTA.SAVE_CHANGE') }}</a-button
      >
      <a-button
        v-else
        type="primary"
        class="ls-button"
        @click="saveQuota(currentDomain.uuid, t('MESSAGES.UPDATE_SUCCESS'))"
        >{{ $t('QUOTA.SAVE_CHANGE') }}</a-button
      >
      <a-button class="ls-button ls-button--cancel">{{ $t('QUOTA.CANCEL') }}</a-button>
      <a-button :loading="loading.reset" class="ls-button ls-button--reset" @click="onResetDomainQuota">{{
        $t('QUOTA.RESET')
      }}</a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { onMounted, reactive, watch } from 'vue';
import useQuota from '../hooks/useQuota';
import { useDomainStore } from '@/modules/domain/store';
import DomainQuotaAndUsedSpace from '@/modules/configuration/pages/quota/components/domain-quota-and-used-space.vue';
import SubdomainsAllocationSettings from '@/modules/configuration/pages/quota/components/subdomains-allocation-settings.vue';
import AllocationWithinTheCurrentDomain from '@/modules/configuration/pages/quota/components/allocation-within-the-current-domain.vue';
// composabled
const { currentRoute } = useRouter();
const { t } = useI18n();
const domainStore = useDomainStore();
const { form, saveQuota, getInformations, resetDomainQuotaInformation, isSubdomain } = useQuota();
const { currentDomain } = storeToRefs(domainStore);

// data
const loading = reactive({
  reset: false,
  page: false,
});

// methods
async function onResetDomainQuota() {
  loading.reset = true;
  await resetDomainQuotaInformation(currentDomain.value.uuid);
  loading.reset = false;
}

function refreshData() {
  loading.page = true;
  Promise.all([getInformations(currentDomain.value.uuid)]).finally(() => {
    loading.page = false;
  });
}

// hooks
watch(currentRoute, (newRoute) => {
  if (newRoute) {
    resetDomainQuotaInformation(currentDomain.value.uuid);
    refreshData();
  }
});

onMounted(async () => {
  refreshData();
});
</script>

<style lang="less">
.quota-page {
  &__tabs {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: 20px;
  }

  &__actions {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 12px;
    padding: 20px 0;
  }

  &__actions .ls-button--reset {
    color: @error-color;
    background-color: #fafafa;
    border-color: #fafafa;
  }

  &__actions .ls-button--cancel {
    color: @link-color;
    background-color: #fafafa;
    border-color: #fafafa;
  }
}

.spinner {
  position: fixed;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background: rgba(f, f, f, 1);
  backdrop-filter: blur(10px);
  top: 0;
  left: 0;
}
</style>
