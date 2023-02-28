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
            <a-switch v-model:checked="form.domainQuotaAndUsedSpace.maintenance" class="maintenance-switch" />
            <span>{{ $t('QUOTA.MAINTENANCE_MODE') }}</span>
          </div>
          <ls-alert
            v-if="form.domainQuotaAndUsedSpace.maintenance"
            :message="$t('QUOTA.MAINTENANCE_MODE_ACTIVATED_ALERT')"
            type="warning"
            :border="true"
            :show-icon="false"
          ></ls-alert>
          <ls-alert
            v-if="quotaExceeded"
            :message="`${$t('QUOTA.QUOTA_EXCEEDED_ERROR')} ${$t('QUOTA.SPACES_LABEL.CURRENT_DOMAIN')}`"
            type="error"
            :border="true"
            :show-icon="false"
          ></ls-alert>
          <div v-if="!isRootDomain" class="domain-shared-quota">
            <a-switch
              v-model:checked="form.domainQuotaAndUsedSpace.domainShared"
              :disabled="!form.domainQuotaAndUsedSpace.domainSharedOverride && !isRootDomain"
              class="domain-shared-quota-switch"
            />
            <a-tooltip :title="t('QUOTA.DOMAIN_SHARED_QUOTA.DESCRIPTION')" trigger="hover">
              <info-icon class="icon"></info-icon>
            </a-tooltip>
            <span>{{ $t('QUOTA.DOMAIN_SHARED_QUOTA.LABEL') }}</span>
            <a-tooltip
              :title="
                form.domainQuotaAndUsedSpace.domainSharedOverride
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
                <lock-icon v-show="!form.domainQuotaAndUsedSpace.domainSharedOverride" class="icon"></lock-icon>
                <unlock-icon v-show="form.domainQuotaAndUsedSpace.domainSharedOverride" class="icon"></unlock-icon>
              </ls-button>
            </a-tooltip>
          </div>
          <quota-input
            v-model:model-unit="form.domainQuotaAndUsedSpace.quotaUnit"
            v-model:model-value="form.domainQuotaAndUsedSpace.quotaSpace"
            v-model:model-override="form.domainQuotaAndUsedSpace.quotaOverride"
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
            <span>{{ $t('QUOTA.DEFAULT_SUB_DOMAIN_QUOTA') }}</span>
            <span class="maximum-quota-value">{{ defaultSubdomainQuota }}</span>
          </div>
        </div>
        <div class="domain-quota-and-used-space__chart">
          <quota-visualize-card :items="quotaVisualizeCardItems"></quota-visualize-card>
        </div>
      </div>
    </collapse-panel>
  </collapse>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useDomainStore } from '@/modules/domain/store';
import LsAlert from '@/core/components/ls/ls-alert.vue';
import LsButton from '@/core/components/ls/ls-button.vue';
import Collapse from '@/core/components/ls/ls-collapse.vue';
import InfoIcon from '@/core/components/icons/info-icon.vue';
import LockIcon from '@/core/components/icons/lock-icon.vue';
import UnlockIcon from '@/core/components/icons/unlock-icon.vue';
import useDomainDelete from '@/modules/domain/hooks/useDomainDelete';
import { byteTo, displayUnit, find } from '@/core/utils/unitStorage';
import CollapsePanel from '@/core/components/ls/ls-collapse-panel.vue';
import useQuota from '@/modules/configuration/pages/quota/hooks/useQuota';
import QuotaInput from '@/modules/configuration/pages/quota/components/quota-input.vue';
import QuotaVisualizeCard from '@/modules/configuration/pages/quota/components/quota-visualize.vue';

// composable
const { t } = useI18n();
const domainStore = useDomainStore();
const currentDomain = domainStore.currentDomain;
const { domainQuotaInformations, form, defaultMaxiQuotaLogic, parentDomainInformations, isExceeded } = useQuota();
const { canDelete } = useDomainDelete();
const { isRootDomain } = storeToRefs(domainStore);
const emits = defineEmits(['update:modeldomainSharedOverride']);

// computed
const disabledQuotaInput = computed(() => {
  return !form.domainQuotaAndUsedSpace.quotaOverride && !isRootDomain.value;
});
const overrideMode = computed(() => {
  return !isRootDomain.value && canDelete.value;
});

const defaultQuotaValue = computed(() => {
  return byteTo(parentDomainInformations.defaultQuota, undefined);
});

const defaultQuotaUnit = computed(() => {
  return find(parentDomainInformations.defaultQuota);
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
  return displayUnit(byteTo, parentDomainInformations.defaultQuota, undefined);
});

const defaultSubdomainQuota = computed(() => {
  return displayUnit(byteTo, parentDomainInformations.defaultQuota, undefined);
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

const quotaExceeded = computed(() => {
  return isExceeded(domainQuotaInformations.usedSpace, domainQuotaInformations.quota);
});

const unallocatedQuota = computed(() => {
  return domainQuotaInformations.quota > parentDomainInformations.defaultQuota
    ? 0
    : parentDomainInformations.defaultQuota - domainQuotaInformations.quota;
});

const quotaVisualizeCardItems = computed(() => {
  const quotaItems = [
    {
      name:
        currentDomain.type === 'ROOTDOMAIN'
          ? t('QUOTA.ROOT_DOMAIN_QUOTA.CURRENT_DOMAIN_USED_SPACE')
          : t('QUOTA.TOP_DOMAIN_QUOTA.CURRENT_DOMAIN_USED_SPACE'),
      value: usedQuota.value,
      color: '#007AFF',
    },
  ];

  if (currentDomain.type !== 'GUESTDOMAIN') {
    quotaItems.push({
      name: t('QUOTA.ROOT_DOMAIN_QUOTA.SUB_DOMAIN_USED_SPACE'),
      value: remainingQuota.value || 0,
      color: '#FFA940',
    });
  }

  quotaItems.push({
    name: t('QUOTA.ROOT_DOMAIN_QUOTA.REMAINING_SPACE'),
    value: unAllocatedSpace.value,
    color: '#EA3C3C',
  });

  if (currentDomain.type !== 'ROOTDOMAIN') {
    quotaItems.push({
      name: t('QUOTA.GUEST_DOMAIN_QUOTA.UNALLOCATED_SPACE'),
      value: unallocatedQuota.value,
      color: '#30CD60',
    });
  }

  return quotaItems;
});

function onClickToggleLockDomainSharedQuota() {
  form.domainQuotaAndUsedSpace.domainSharedOverride = !form.domainQuotaAndUsedSpace.domainSharedOverride;
  emits('update:modeldomainSharedOverride', form.domainQuotaAndUsedSpace.domainSharedOverride);
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
  min-height: 44px;
  min-width: 44px;
  height: 44px;
  width: 44px;
  padding: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
</style>
