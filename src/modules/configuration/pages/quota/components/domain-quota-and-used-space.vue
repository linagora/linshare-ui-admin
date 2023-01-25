<template>
  <collapse
    ><collapse-panel :key="1" :header="$t('QUOTA.QUOTA_AND_USED_SPACE')">
      <ls-alert
        :message="$t('QUOTA.QUOTA_AND_USED_INFORMATIONS_ALERT')"
        type="info"
        banner
        :show-icon="false"
      ></ls-alert>
      <div class="domain-quota-and-used-space">
        <div class="domain-quota-and-used-space__form">
          <div class="maintenance-mode">
            <a-switch v-model:checked="form.domain_quota_and_used_space.maintenance" class="maintenance-switch" />
            <span>{{ $t('QUOTA.MAINTENANCE_MODE') }}</span>
          </div>
          <ls-alert
            v-if="form.domain_quota_and_used_space.maintenance"
            :message="$t('QUOTA.MAINTENANCE_MODE_ACTIVATED_ALERT')"
            type="warning"
            :border="true"
            :show-icon="false"
          ></ls-alert>
          <quota-input
            v-model:model-unit="form.domain_quota_and_used_space.quotaUnit"
            v-model:model-value="form.domain_quota_and_used_space.quotaSpace"
            :label="$t('QUOTA.DOMAIN_QUOTA')"
            :note="inputNote"
          ></quota-input>
          <div v-if="currentDomain.type !== 'ROOTDOMAIN'" class="maximum-quota">
            <span v-if="!defaultMaxiQuotaLogic()">{{ $t('QUOTA.DOMAIN_MAXIMUM_QUOTA') }}</span>
            <span v-else class="save-check-wrong">{{ $t('QUOTA.DOMAIN_MAXIMUM_QUOTA') }}</span>
            <span v-if="!defaultMaxiQuotaLogic()" class="maximum-quota-value">{{ maximumQuota }}</span>
            <span v-else class="save-check-wrong">{{ maximumQuota }}</span>
          </div>
          <div v-if="currentDomain.type === 'TOPDOMAIN'" class="maximum-quota">
            <span v-if="defaultSubdomainQuotaLogic()" class="save-check-wrong">{{
              $t('QUOTA.DEFAULT_SUB_DOMAIN_QUOTA')
            }}</span>
            <span v-else>{{ $t('QUOTA.DEFAULT_SUB_DOMAIN_QUOTA') }}</span>
            <span v-if="defaultSubdomainQuotaLogic()" class="save-check-wrong">{{ defaultQuota }}</span>
            <span v-else class="maximum-quota-value">{{ defaultQuota }}</span>
          </div>
        </div>
        <div class="domain-quota-and-used-space__chart">
          <QuotaVisualizeCard
            :used-space="usedQuota"
            :remaining-quota="remainingQuota"
            :unallocated-space="unAllocatedSpace"
            :sub-quota="subQuota"
          ></QuotaVisualizeCard>
        </div>
      </div>
    </collapse-panel>
  </collapse>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDomainStore } from '@/modules/domain/store';
import useQuota from '@/modules/configuration/pages/quota/hooks/useQuota';
import LsAlert from '@/core/components/ls/ls-alert.vue';
import Collapse from '@/core/components/ls/ls-collapse.vue';
import CollapsePanel from '@/core/components/ls/ls-collapse-panel.vue';
import QuotaVisualizeCard from '@/modules/configuration/pages/quota/components/quota-visualize.vue';
import QuotaInput from '@/modules/configuration/pages/quota/components/quota-input.vue';
import { byteTo, displayUnit } from '@/core/utils/unitStorage';

// composable
const { t } = useI18n();
const domainStore = useDomainStore();
const currentDomain = domainStore.currentDomain;
const { domainQuotaInformations, form, defaultMaxiQuotaLogic, defaultSubdomainQuotaLogic, parentDomainInformations } =
  useQuota();

// computed
const subQuota = computed(() => {
  return domainQuotaInformations.currentValueForSubdomains;
});

const unAllocatedSpace = computed(() => {
  return domainQuotaInformations.quota - domainQuotaInformations.usedSpace;
});
const usedQuota = computed(() => {
  return domainQuotaInformations.usedSpace;
});

const remainingQuota = computed(() => {
  return domainQuotaInformations.currentValueForSubdomains;
});
const maximumQuota = computed(() => {
  return displayUnit(byteTo, parentDomainInformations.quota, undefined);
});
const defaultQuota = computed(() => {
  return displayUnit(byteTo, domainQuotaInformations.defaultQuota, undefined);
});

const inputNote = computed(() => {
  return `${displayUnit(byteTo, domainQuotaInformations.usedSpace, undefined)}/${displayUnit(
    byteTo,
    domainQuotaInformations.quota,
    undefined
  )} ${t('QUOTA.ALREADY_USED')} (${((domainQuotaInformations.usedSpace / domainQuotaInformations.quota) * 100).toFixed(
    1
  )}%)`;
});
</script>

<style lang="less" scoped>
.domain-quota-and-used-space {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 48px;
  margin-top: 20px;
  &__form {
    max-width: 50%;
  }
}

.card-title {
  margin-top: 15px;
}

.maintenance-mode {
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
}

.maintenance-switch {
  margin-right: 5px;
}

.maximum-quota {
  margin-top: 15px;
  color: #6d7885;
}

.maximum-quota-value {
  color: black;
  font-weight: bolder;
}
.save-check-wrong {
  color: red;
  font-weight: bolder;
}
</style>
