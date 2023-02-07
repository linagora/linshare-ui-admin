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
          <div class="domain-shared-quota">
            <a-tooltip :title="t('QUOTA.DOMAIN_SHARED_QUOTA.DESCRIPTION')" trigger="hover">
              <info-icon class="icon"></info-icon>
            </a-tooltip>
            <a-switch
              v-model:checked="form.domain_quota_and_used_space.domainShared"
              :disabled="form.domain_quota_and_used_space.domainSharedOverride && !isRootDomain"
              class="domain-shared-quota-switch"
            />
            <span>{{ $t('QUOTA.DOMAIN_SHARED_QUOTA.LABEL') }}</span>
            <a-tooltip
              :title="
                form.domain_quota_and_used_space.domainSharedOverride
                  ? t('QUOTA.HINT_LABELS.HINT_DESACTIVATE_SHARING_TOOLTIP')
                  : t('QUOTA.HINT_LABELS.HINT_ACTIVATE_SHARING_TOOLTIP')
              "
              trigger="hover"
            >
              <ls-button
                v-if="!isRootDomain && canDelete"
                class="ant-btn ls-button--info domain-shared-quota-lock-button"
                color="info"
                @click="onClickToggleLockDomainSharedQuota"
              >
                <lock-icon v-show="form.domain_quota_and_used_space.domainSharedOverride" class="icon"></lock-icon>
                <unlock-icon v-show="!form.domain_quota_and_used_space.domainSharedOverride" class="icon"></unlock-icon>
              </ls-button>
            </a-tooltip>
          </div>
          <quota-input
            v-model:model-unit="form.domain_quota_and_used_space.quotaUnit"
            v-model:model-value="form.domain_quota_and_used_space.quotaSpace"
            v-model:model-override="form.domain_quota_and_used_space.quotaOverride"
            :default-quota="defaultQuota"
            :default-value="defaultQuotaValue"
            :default-unit="defaultQuotaUnit"
            :label="$t('QUOTA.DOMAIN_QUOTA')"
            :hint="inputNote"
            :override-mode="overrideMode"
            :disabled="disabledQuotaInput"
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
import { byteTo, displayUnit, find } from '@/core/utils/unitStorage';
import LockIcon from '@/core/components/icons/lock-icon.vue';
import UnlockIcon from '@/core/components/icons/unlock-icon.vue';
import InfoIcon from '@/core/components/icons/info-icon.vue';
import useDomainDelete from '@/modules/domain/hooks/useDomainDelete';
import { storeToRefs } from 'pinia';

// composable
const { t } = useI18n();
const domainStore = useDomainStore();
const currentDomain = domainStore.currentDomain;
const { domainQuotaInformations, form, defaultMaxiQuotaLogic, defaultSubdomainQuotaLogic, parentDomainInformations } =
  useQuota();
const { canDelete } = useDomainDelete();
const { isRootDomain } = storeToRefs(domainStore);
const emits = defineEmits(['update:modeldomainSharedOverride']);

// computed
const disabledQuotaInput = computed(() => {
  return !form.domain_quota_and_used_space.quotaOverride && !isRootDomain.value;
});
const overrideMode = computed(() => {
  return !isRootDomain.value && canDelete.value;
});

const subQuota = computed(() => {
  return domainQuotaInformations.currentValueForSubdomains;
});

const defaultQuotaValue = computed(() => {
  return byteTo(domainQuotaInformations.defaultQuota, undefined);
});

const defaultQuotaUnit = computed(() => {
  return find(domainQuotaInformations.defaultQuota);
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

function onClickToggleLockDomainSharedQuota() {
  form.domain_quota_and_used_space.domainSharedOverride = !form.domain_quota_and_used_space.domainSharedOverride;
  emits('update:modeldomainSharedOverride', form.domain_quota_and_used_space.domainSharedOverride);
}
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

.maintenance-mode,
.domain-shared-quota {
  display: flex;
  flex-direction: row;
  margin: 10px 0;
  gap: 12px;
  align-items: center;
}

.domain-shared-quota-switch {
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

.domain-shared-quota-lock-button {
  align-items: center;
}
</style>
