<template>
  <div :key="data.key" class="quota-page">
    <div class="quota-page__tabs">
      <domain-quota-and-used-space> </domain-quota-and-used-space>
    </div>
    <div class="quota-page__actions">
      <a-button type="primary" class="ls-button">{{ $t('QUOTA.SAVE_CHANGE') }}</a-button>
      <a-button class="ls-button ls-button--cancel">{{ $t('QUOTA.CANCEL') }}</a-button>
      <a-button :loading="loading.reset" class="ls-button ls-button--reset" @click="onResetDomainQuota">{{
        $t('QUOTA.RESET')
      }}</a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { onMounted, reactive, watch } from 'vue';
import useQuota from '../hooks/useQuota';
import { useDomainStore } from '@/modules/domain/store';
import DomainQuotaAndUsedSpace from '../components/domain-quota-and-used-space.vue';

// composabled
const { currentRoute } = useRouter();
const domainStore = useDomainStore();
const { getInformations, resetDomainQuotaInformation } = useQuota();
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
  }
});

onMounted(() => {
  getInformations(currentDomain.value.uuid);
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
