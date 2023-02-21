<template>
  <collapse
    ><collapse-panel :header="$t('QUOTA.SUBDOMAINS_ALLOCATION_SETTINGS')">
      <span class="section-title">{{ $t('QUOTA.SUBDOMAIN_QUOTA') }}</span>
      <div class="subdomain-allocation-settings">
        <div class="subdomain-allocation-settings__form">
          <div class="shared-quota-mode">
            <a-switch v-model:checked="form.subdomainAllocationSettings.shared" class="shared-quota-switch" />
            <span>{{ $t('QUOTA.SHRAED_DOMAIN_QUOTA_ACTIVATION') }}</span>
          </div>
          <quota-input
            v-model:model-unit="form.subdomainAllocationSettings.quotaUnit"
            v-model:model-value="form.subdomainAllocationSettings.quotaSpace"
            v-model:model-override="form.subdomainAllocationSettings.quotaSpaceOverride"
            :default-quota="defaultQuota"
            :default-value="defaultQuotaValue"
            :default-unit="defaultQuotaUnit"
            :override-mode="overrideMode"
            :disabled="disabledQuotaInput.quotaSpace"
            :label="$t('QUOTA.QUOTA_PER_SUB_DOMAIN')"
          ></quota-input>
          <div v-if="maxQuotaLogic()" class="quota-per-subdomain">
            <div class="input-logic-alert">
              <span>{{ $t('QUOTA.DOMAIN_MAXIMUM_QUOTA') }}</span>
              <span>{{ maximumQuota }}</span>
            </div>
          </div>
          <div v-else class="quota-per-subdomain">
            <span>{{ $t('QUOTA.DOMAIN_MAXIMUM_QUOTA') }}</span>
            <span class="quota-per-subdomain-value">{{ maximumQuota }}</span>
          </div>
          <div class="horizontal-line"></div>
          <span class="section-title">{{ $t('QUOTA.PERSONAL_SPACE_QUOTA') }}</span>
          <quota-input
            v-model:model-unit="
              form.allocationWithinTheCurrentDomain.personalSpacesAllocatedQuotaForAllPersonalSpacesUnit
            "
            v-model:model-value="form.allocationWithinTheCurrentDomain.personalSpacesAllocatedQuotaForAllPersonalSpaces"
            v-model:model-override="
              form.allocationWithinTheCurrentDomain.personalSpacesAllocatedQuotaForAllPersonalSpacesOverride
            "
            :default-quota="defaultQuotaAllocated"
            :default-value="defaultQuotaAllocatedValue"
            :default-unit="defaultQuotaAllocatedUnit"
            :override-mode="overrideMode"
            :disabled="
              disabledQuotaInput.personalSpacesAllocatedQuotaForAllPersonalSpaces ||
              form.subdomainAllocationSettings.shared
            "
            :lock-disabled="form.subdomainAllocationSettings.shared"
            :label="$t('QUOTA.ALL_SPACE_ALLOCATED_QUOTA')"
            class="input"
          ></quota-input>
          <span v-if="personalSpaceQuotaLogic()" class="input-logic-alert">{{
            `${t('QUOTA.ERROR_MESSAGE_FIELD')}  ${personalQuotaAlert}`
          }}</span>
          <quota-input
            v-model:model-unit="form.allocationWithinTheCurrentDomain.defaultAccountQuotaUnit"
            v-model:model-value="form.allocationWithinTheCurrentDomain.defaultAccountQuota"
            v-model:model-override="form.allocationWithinTheCurrentDomain.defaultAccountQuotaOverride"
            :default-quota="defaultPersonalSpaceQuota"
            :default-value="defaultPersonalSpaceQuotaValue"
            :default-unit="defaultPersonalSpaceQuotaUnit"
            :override-mode="overrideMode"
            :disabled="
              disabledQuotaInput.personalSpacesDefaultAllocatedQuotaPerUser || form.subdomainAllocationSettings.shared
            "
            :lock-disabled="form.subdomainAllocationSettings.shared"
            :label="$t('QUOTA.DEFAULT_ALLOCATED_QUOTA_PER_USER')"
            :hint="$t('QUOTA.CANNOT_EXCEED_ALLOCATED_DOMAIN_QUOTA')"
            class="input"
          ></quota-input>
          <span v-if="personalSpaceQuotaPerUserLogic()" class="input-logic-alert">{{
            `${t('QUOTA.ERROR_MESSAGE_FIELD')}  ${personalQuotaPerUserAlert}`
          }}</span>
          <quota-input
            v-model:model-unit="form.allocationWithinTheCurrentDomain.defaultMaxFileSizeUnit"
            v-model:model-value="form.allocationWithinTheCurrentDomain.defaultMaxFileSize"
            v-model:model-override="form.allocationWithinTheCurrentDomain.defaultMaxFileSizeOverride"
            :default-quota="defaultPersonalSpaceQuotaMaxFileSize"
            :default-value="defaultPersonalSpaceQuotaMaxFileSizeValue"
            :default-unit="defaultPersonalSpaceQuotaMaxFileSizeUnit"
            :override-mode="overrideMode"
            :disabled="disabledQuotaInput.personalSpacesDefaultPersonalQuotaMaxFileSize"
            :label="$t('QUOTA.DEFAULT_MAX_FILE_SIZE')"
            :hint="$t('QUOTA.CANNOT_EXCEED_ALLOCATED_DOMAIN_QUOTA')"
            class="input"
          ></quota-input>
          <span v-if="personalSpaceMaxSizeLogic()" class="input-logic-alert">{{
            `${t('QUOTA.ERROR_MESSAGE_FIELD')}  ${personalQuotaMaxSizeAlert}`
          }}</span>
          <div class="horizontal-line"></div>
          <span class="section-title">{{ $t('QUOTA.SHARED_SPACE_QUOTA') }}</span>
          <quota-input
            v-model:model-unit="form.subdomainAllocationSettings.sharedSpaceDefaultTotalAllocatedQuotaUnit"
            v-model:model-value="form.subdomainAllocationSettings.sharedSpaceDefaultTotalAllocatedQuota"
            v-model:model-override="form.subdomainAllocationSettings.defaultQuotaOverride"
            :default-quota="defaultTotalSharedSpaceAllocatedQuota"
            :default-value="defaultTotalSharedSpaceAllocatedQuotaValue"
            :default-unit="defaultTotalSharedSpaceAllocatedQuotaUnit"
            :override-mode="overrideMode"
            :disabled="
              disabledQuotaInput.sharedSpaceDefaultTotalAllocatedQuota || form.subdomainAllocationSettings.shared
            "
            :lock-disabled="form.subdomainAllocationSettings.shared"
            :label="$t('QUOTA.DEFAULT_TOTAL_ALLOCATED_QUOTA')"
            class="input"
          ></quota-input>
          <span v-if="totalSharedSpaceQuotaLogic()" class="input-logic-alert">{{
            `${t('QUOTA.ERROR_MESSAGE_FIELD')}  ${totalSharedSpaceQuotaAlert}`
          }}</span>

          <quota-input
            v-model:model-unit="form.subdomainAllocationSettings.personalSpacesDefaultPersonalQuotaMaxFileSizeUnit"
            v-model:model-value="form.subdomainAllocationSettings.personalSpacesDefaultPersonalQuotaMaxFileSize"
            v-model:model-override="form.subdomainAllocationSettings.defaultMaxFileSizeOverride"
            :default-quota="defaultTotalSharedSpaceAllocatedQuotaMaxSize"
            :default-value="defaultTotalSharedSpaceAllocatedQuotaMaxSizeValue"
            :default-unit="defaultTotalSharedSpaceAllocatedQuotaMaxSizeUnit"
            :override-mode="overrideMode"
            :disabled="disabledQuotaInput.sharedSpaceDefaultQuotaMaxFileSize"
            :label="$t('QUOTA.DEFAULT_MAX_FILE_SIZE')"
            class="input"
          ></quota-input>
          <span v-if="shareSpaceDefaultMaxSizeLogic()" class="input-logic-alert">{{
            `${t('QUOTA.ERROR_MESSAGE_FIELD')}  ${shareSpaceDefaultMaxSizeAlert}`
          }}</span>
          <br />
          <router-link :to="{ name: 'UsersList' }">
            <span>{{ $t('QUOTA.ALLOCAED_QUOTA_SPECIFIC_USER_ACCOUNT') }} <PlusCircleOutlined /></span>
          </router-link>
        </div>
        <div class="subdomain-allocation-settings__chart">
          <quota-visualize-card :items="subsomainAllocatedQuotaVisualizeCardItems"></quota-visualize-card>
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
import useQuota from '@/modules/configuration/pages/quota/hooks/useQuota';
import { PlusCircleOutlined } from '@ant-design/icons-vue';
import Collapse from '@/core/components/ls/ls-collapse.vue';
import CollapsePanel from '@/core/components/ls/ls-collapse-panel.vue';
import QuotaVisualizeCard from '@/modules/configuration/pages/quota/components/quota-visualize.vue';
import QuotaInput from '@/modules/configuration/pages/quota/components/quota-input.vue';
import { byteTo, displayUnit, find, toByte } from '@/core/utils/unitStorage';
import useDomainDelete from '@/modules/domain/hooks/useDomainDelete';

const { t } = useI18n();
const domainStore = useDomainStore();
const { canDelete } = useDomainDelete();
const { isRootDomain } = storeToRefs(domainStore);
const {
  form,
  domainQuotaInformations,
  subdomainContainerInformations,
  allocationContainerInformations,
  maxQuotaLogic,
  personalSpaceQuotaLogic,
  personalSpaceMaxSizeLogic,
  personalSpaceQuotaPerUserLogic,
  parentAllocationInformations,
  parentSubdomainInformations,
  totalSharedSpaceQuotaLogic,
  shareSpaceDefaultMaxSizeLogic,
} = useQuota();

// computeds
const subQuota = computed(() => {
  return domainQuotaInformations.defaultQuota * 2 - (usedQuota.value + remainingQuota.value);
});

const usedQuota = computed(() => {
  return subdomainContainerInformations.defaultQuota;
});

const remainingQuota = computed(() => {
  return allocationContainerInformations.defaultQuota;
});
const maximumQuota = computed(() => {
  const value = toByte(form.domainQuotaAndUsedSpace.quotaSpace, form.domainQuotaAndUsedSpace.quotaUnit);
  return displayUnit(byteTo, value, undefined);
});

const defaultQuotaValue = computed(() => {
  return byteTo(domainQuotaInformations.defaultQuota, undefined);
});

const defaultQuotaUnit = computed(() => {
  return find(domainQuotaInformations.defaultQuota);
});

const defaultQuota = computed(() => {
  return displayUnit(byteTo, domainQuotaInformations.defaultQuota, undefined);
});

const personalQuotaAlert = computed(() => {
  const value = toByte(form.subdomainAllocationSettings.quotaSpace, form.subdomainAllocationSettings.quotaUnit);
  return displayUnit(byteTo, value, undefined);
});

const personalQuotaPerUserAlert = computed(() => {
  const value = toByte(
    form.allocationWithinTheCurrentDomain.personalSpacesAllocatedQuotaForAllPersonalSpaces,
    form.allocationWithinTheCurrentDomain.personalSpacesAllocatedQuotaForAllPersonalSpacesUnit
  );
  return displayUnit(byteTo, value, undefined);
});

const personalQuotaMaxSizeAlert = computed(() => {
  const value = toByte(
    form.allocationWithinTheCurrentDomain.defaultAccountQuota,
    form.allocationWithinTheCurrentDomain.defaultAccountQuotaUnit
  );
  return displayUnit(byteTo, value, undefined);
});

const totalSharedSpaceQuotaAlert = computed(() => {
  const value = toByte(form.allocationWithinTheCurrentDomain.quota, form.allocationWithinTheCurrentDomain.quotaUnit);
  return displayUnit(byteTo, value, undefined);
});

const shareSpaceDefaultMaxSizeAlert = computed(() => {
  const value = toByte(
    form.subdomainAllocationSettings.sharedSpaceDefaultTotalAllocatedQuota,
    form.subdomainAllocationSettings.sharedSpaceDefaultTotalAllocatedQuotaUnit
  );
  return displayUnit(byteTo, value, undefined);
});

const overrideMode = computed(() => {
  return !isRootDomain.value && canDelete.value;
});

const disabledQuotaInput = computed(() => {
  return {
    quotaSpace: !form.subdomainAllocationSettings.quotaSpaceOverride && !isRootDomain.value,
    personalSpacesAllocatedQuotaForAllPersonalSpaces:
      !form.allocationWithinTheCurrentDomain.personalSpacesAllocatedQuotaForAllPersonalSpacesOverride &&
      !isRootDomain.value,
    personalSpacesDefaultAllocatedQuotaPerUser:
      !form.allocationWithinTheCurrentDomain.defaultAccountQuotaOverride && !isRootDomain.value,
    personalSpacesDefaultPersonalQuotaMaxFileSize:
      !form.allocationWithinTheCurrentDomain.defaultMaxFileSizeOverride && !isRootDomain.value,
    sharedSpaceDefaultTotalAllocatedQuota:
      !form.subdomainAllocationSettings.defaultQuotaOverride && !isRootDomain.value,
    sharedSpaceDefaultQuotaMaxFileSize:
      !form.subdomainAllocationSettings.defaultMaxFileSizeOverride && !isRootDomain.value,
  };
});

const defaultQuotaAllocatedValue = computed(() => {
  return byteTo(parentAllocationInformations.defaultQuota, undefined);
});

const defaultQuotaAllocatedUnit = computed(() => {
  return find(parentAllocationInformations.defaultQuota);
});

const defaultPersonalSpaceQuotaValue = computed(() => {
  return byteTo(parentAllocationInformations.defaultAccountQuota, undefined);
});

const defaultPersonalSpaceQuotaUnit = computed(() => {
  return find(parentAllocationInformations.defaultAccountQuota);
});

const defaultPersonalSpaceQuotaMaxFileSizeValue = computed(() => {
  return byteTo(parentAllocationInformations.defaultMaxFileSize, undefined);
});

const defaultPersonalSpaceQuotaMaxFileSizeUnit = computed(() => {
  return find(parentAllocationInformations.defaultMaxFileSize);
});

const defaultTotalSharedSpaceAllocatedQuotaValue = computed(() => {
  return byteTo(parentSubdomainInformations.defaultQuota, undefined);
});

const defaultTotalSharedSpaceAllocatedQuotaUnit = computed(() => {
  return find(parentSubdomainInformations.defaultQuota);
});

const defaultTotalSharedSpaceAllocatedQuotaMaxSizeValue = computed(() => {
  return byteTo(parentSubdomainInformations.defaultMaxFileSize, undefined);
});

const defaultTotalSharedSpaceAllocatedQuotaMaxSizeUnit = computed(() => {
  return find(parentSubdomainInformations.defaultMaxFileSize);
});

const defaultQuotaAllocated = computed(() => {
  return displayUnit(byteTo, parentAllocationInformations.defaultQuota, undefined);
});

const defaultPersonalSpaceQuota = computed(() => {
  return displayUnit(byteTo, parentAllocationInformations.defaultAccountQuota, undefined);
});

const defaultPersonalSpaceQuotaMaxFileSize = computed(() => {
  return displayUnit(byteTo, parentAllocationInformations.defaultMaxFileSize, undefined);
});

const defaultTotalSharedSpaceAllocatedQuota = computed(() => {
  return displayUnit(byteTo, parentSubdomainInformations.defaultQuota, undefined);
});

const defaultTotalSharedSpaceAllocatedQuotaMaxSize = computed(() => {
  return displayUnit(byteTo, parentSubdomainInformations.defaultMaxFileSize, undefined);
});

const subsomainAllocatedQuotaVisualizeCardItems = computed(() => {
  const quotaItems = [
    {
      name: t('QUOTA.GUEST_DOMAIN_QUOTA.PERSONAL_ALLOCATED_SPACE'),
      value: remainingQuota.value,
      color: '#007AFF',
    },
    {
      name: t('QUOTA.GUEST_DOMAIN_QUOTA.SHARED_SPACE_ALLOCATED'),
      value: usedQuota.value,
      color: '#FFA940',
    },
    {
      name: t('QUOTA.GUEST_DOMAIN_QUOTA.UNASSIGNED_SPACE'),
      value: subQuota.value,
      color: '#EA3C3C',
    },
  ];
  return quotaItems;
});
</script>

<style lang="less" scoped>
.subdomain-allocation-settings {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 48px;
  margin-top: 20px;
  &__form {
    width: 45%;
  }
  &__chart {
    width: 50%;
    max-width: 50%;
  }
}

.shared-quota-mode {
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
}

.shared-quota-switch {
  margin-right: 5px;
}

.quota-per-subdomain {
  margin-top: 25px;
  color: #6d7885;
}

.quota-per-subdomain-value {
  color: black;
  font-weight: bolder;
}

.section-title {
  font-weight: 500;
}

.horizontal-line {
  margin-top: 25px;
  margin-bottom: 25px;
  width: 100%;
  height: 2px;
  background-color: #d7d7d7;
}
.input {
  margin-top: 25px;
  margin-bottom: 25px;
}
.input-logic-alert {
  color: red;
  font-weight: bolder;
}
</style>
