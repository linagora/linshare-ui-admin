<template>
  <collapse
    ><collapse-panel :header="$t('QUOTA.SUBDOMAINS_ALLOCATION_SETTINGS')">
      <span class="section-title">{{ $t('QUOTA.SUBDOMAIN_QUOTA') }}</span>
      <div class="subdomain-allocation-settings">
        <div class="subdomain-allocation-settings__form">
          <div class="shared-quota-mode">
            <a-switch v-model:checked="form.subdomain_allocation_settings.shared" class="shared-quota-switch" />
            <span>{{ $t('QUOTA.SHRAED_DOMAIN_QUOTA_ACTIVATION') }}</span>
          </div>
          <quota-input
            v-model:model-unit="form.subdomain_allocation_settings.quotaUnit"
            v-model:model-value="form.subdomain_allocation_settings.quotaSpace"
            v-model:model-override="form.subdomain_allocation_settings.quotaOverride"
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
            v-model:model-unit="form.subdomain_allocation_settings.personalQuotaUnit"
            v-model:model-value="form.subdomain_allocation_settings.personalQuota"
            v-model:model-override="form.subdomain_allocation_settings.defaultAccountQuotaOverride"
            :default-quota="personalSpaceQuota"
            :default-value="form.subdomain_allocation_settings.personalQuota"
            :default-unit="form.subdomain_allocation_settings.personalQuotaUnit"
            :override-mode="overrideMode"
            :disabled="disabledQuotaInput.personalQuota"
            :label="$t('QUOTA.ALL_SPACE_ALLOCATED_QUOTA')"
            class="input"
          ></quota-input>
          <span v-if="personalSpaceQuotaLogic()" class="input-logic-alert">{{
            `${t('QUOTA.ERROR_MESSAGE_FIELD')}  ${personalQuotaAlert}`
          }}</span>
          <quota-input
            v-model:model-unit="form.subdomain_allocation_settings.defaultQuotaPerUserUnit"
            v-model:model-value="form.subdomain_allocation_settings.defaultQuotaPerUser"
            v-model:model-override="form.subdomain_allocation_settings.defaultAccountQuotaOverride"
            :default-quota="personalSpaceQuotaPerUser"
            :default-value="form.subdomain_allocation_settings.defaultQuotaPerUser"
            :default-unit="form.subdomain_allocation_settings.defaultQuotaPerUserUnit"
            :override-mode="overrideMode"
            :disabled="disabledQuotaInput.defaultQuotaPerUser"
            :label="$t('QUOTA.DEFAULT_ALLOCATED_QUOTA_PER_USER')"
            :hint="$t('QUOTA.CANNOT_EXCEED_ALLOCATED_DOMAIN_QUOTA')"
            class="input"
          ></quota-input>
          <span v-if="personalSpaceQuotaPerUserLogic()" class="input-logic-alert">{{
            `${t('QUOTA.ERROR_MESSAGE_FIELD')}  ${personalQuotaPerUserAlert}`
          }}</span>
          <quota-input
            v-model:model-unit="form.subdomain_allocation_settings.defaultPersonalQuotaMaxFileSizeUnit"
            v-model:model-value="form.subdomain_allocation_settings.defaultPersonalQuotaMaxFileSize"
            v-model:model-override="form.subdomain_allocation_settings.defaultMaxFileSizeOverride"
            :default-quota="personalSpaceMaxSize"
            :default-value="form.subdomain_allocation_settings.defaultPersonalQuotaMaxFileSize"
            :default-unit="form.subdomain_allocation_settings.defaultPersonalQuotaMaxFileSizeUnit"
            :override-mode="overrideMode"
            :disabled="disabledQuotaInput.defaultPersonalQuotaMaxFileSize"
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
            v-model:model-unit="form.subdomain_allocation_settings.defaultTotalAllocatedQuotaUnit"
            v-model:model-value="form.subdomain_allocation_settings.defaultTotalAllocatedQuota"
            v-model:model-override="form.subdomain_allocation_settings.defaultQuotaOverride"
            :override-mode="overrideMode"
            :disabled="disabledQuotaInput.defaultTotalAllocatedQuota"
            :label="$t('QUOTA.DEFAULT_TOTAL_ALLOCATED_QUOTA')"
            class="input"
          ></quota-input>
          <quota-input
            v-model:model-unit="form.subdomain_allocation_settings.defaultSharedspaceQuotaMaxFileSizeUnit"
            v-model:model-value="form.subdomain_allocation_settings.defaultSharedspaceQuotaMaxFileSize"
            v-model:model-override="form.subdomain_allocation_settings.defaultMaxFileSizeOverride"
            :override-mode="overrideMode"
            :disabled="disabledQuotaInput.defaultSharedspaceQuotaMaxFileSize"
            :label="$t('QUOTA.DEFAULT_MAX_FILE_SIZE')"
            class="input"
          ></quota-input>
          <router-link :to="{ name: 'UsersList' }">
            <span>{{ $t('QUOTA.ALLOCAED_QUOTA_SPECIFIC_USER_ACCOUNT') }} <PlusCircleOutlined /></span>
          </router-link>
        </div>
        <div class="subdomain-allocation-settings__chart">
          <QuotaVisualizeCard
            :used-space="usedQuota"
            :remaining-quota="remainingQuota"
            :unallocated-space="subQuota"
          ></QuotaVisualizeCard>
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
  domainQuotaInformations,
  form,
  personalSpaceQuotaLogic,
  subdomainContainerInformations,
  AllocationContainerInformations,
  personalSpaceQuotaPerUserLogic,
  personalSpaceMaxSizeLogic,
  maxQuotaLogic,
} = useQuota();

// computeds
const subQuota = computed(() => {
  return domainQuotaInformations.defaultQuota * 2;
});

const usedQuota = computed(() => {
  return subdomainContainerInformations.defaultQuota;
});

const remainingQuota = computed(() => {
  return AllocationContainerInformations.defaultQuota;
});
const maximumQuota = computed(() => {
  const value = toByte(form.domain_quota_and_used_space.quotaSpace, form.domain_quota_and_used_space.quotaUnit);
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

const personalSpaceQuota = computed(() => {
  return displayUnit(byteTo, form.subdomain_allocation_settings.personalQuota, undefined);
});

const personalSpaceQuotaPerUser = computed(() => {
  return displayUnit(byteTo, form.subdomain_allocation_settings.defaultQuotaPerUser, undefined);
});

const personalSpaceMaxSize = computed(() => {
  return displayUnit(byteTo, form.subdomain_allocation_settings.defaultPersonalQuotaMaxFileSize, undefined);
});

const personalQuotaAlert = computed(() => {
  const value = toByte(form.subdomain_allocation_settings.quotaSpace, form.subdomain_allocation_settings.quotaUnit);
  return displayUnit(byteTo, value, undefined);
});

const personalQuotaPerUserAlert = computed(() => {
  const value = toByte(
    form.subdomain_allocation_settings.personalQuota,
    form.subdomain_allocation_settings.personalQuotaUnit
  );
  return displayUnit(byteTo, value, undefined);
});

const personalQuotaMaxSizeAlert = computed(() => {
  const value = toByte(
    form.subdomain_allocation_settings.defaultQuotaPerUser,
    form.subdomain_allocation_settings.defaultQuotaPerUserUnit
  );
  return displayUnit(byteTo, value, undefined);
});

const overrideMode = computed(() => {
  return !isRootDomain.value && canDelete.value;
});

const disabledQuotaInput = computed(() => {
  return {
    quotaSpace: !form.subdomain_allocation_settings.quotaOverride && !isRootDomain.value,
    personalQuota: !form.subdomain_allocation_settings.defaultAccountQuotaOverride && !isRootDomain.value,
    defaultQuotaPerUser: !form.subdomain_allocation_settings.defaultAccountQuotaOverride && !isRootDomain.value,
    defaultPersonalQuotaMaxFileSize: !form.subdomain_allocation_settings.maxFileSizeOverride && !isRootDomain.value,
    defaultTotalAllocatedQuota: !form.subdomain_allocation_settings.defaultQuotaOverride && !isRootDomain.value,
    defaultSharedspaceQuotaMaxFileSize:
      !form.subdomain_allocation_settings.defaultMaxFileSizeOverride && !isRootDomain.value,
  };
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
}
</style>
