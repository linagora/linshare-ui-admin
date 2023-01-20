<template>
  <div :key="data.key" class="quota-page">
    <div class="quota-page__tabs">
      <domain-quota-and-used-space> </domain-quota-and-used-space>
      <subdomains-allocation-settings></subdomains-allocation-settings>
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
import DomainQuotaAndUsedSpace from '../components/domain-quota-and-used-space.vue';
import SubdomainsAllocationSettings from '../components/subdomains-allocation-settings.vue';

// composabled
const { currentRoute } = useRouter();
const { t } = useI18n();
const domainStore = useDomainStore();
const {
  getInformations,
  resetDomainQuotaInformation,
  getSubdomainBlockInformations,
  getAllocationBlockInformations,
  saveQuota,
  form,
} = useQuota();
const { currentDomain } = storeToRefs(domainStore);

// data
const data = reactive({
  key: 0,
});
const loading = reactive({
  reset: false,
});

// methods
async function onResetDomainQuota() {
  loading.reset = true;
  await resetDomainQuotaInformation(currentDomain.value.uuid);
  loading.reset = false;
}

// hooks
watch(currentRoute, (newRoute) => {
  if (newRoute) {
    data.key += 1;
    resetDomainQuotaInformation(currentDomain.value.uuid);
  }
});

onMounted(() => {
  getInformations(currentDomain.value.uuid);
  getSubdomainBlockInformations(currentDomain.value.uuid);
  getAllocationBlockInformations(currentDomain.value.uuid);
});
</script>

<style lang="less">
.quota-page {
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
</style>
