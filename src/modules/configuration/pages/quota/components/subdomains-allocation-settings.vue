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
            v-model:model-default-quota="defaultQuota"
            v-model:model-default-value="defaultQuotaValue"
            v-model:model-default-unit="defaultQuotaUnit"
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
            v-model:model-override="form.subdomain_allocation_settings.defaultQuotaOverride"
            v-model:model-default-quota="personalSpaceQuota"
            v-model:model-default-value="form.subdomain_allocation_settings.personalQuota"
            v-model:model-default-unit="form.subdomain_allocation_settings.personalQuotaUnit"
            class="input"
            :label="$t('QUOTA.ALL_SPACE_ALLOCATED_QUOTA')"
          ></quota-input>
          <span v-if="personalSpaceQuotaLogic()" class="input-logic-alert">{{
            `${t('QUOTA.ERROR_MESSAGE_FIELD')}  ${personalQuotaAlert}`
          }}</span>
          <quota-input
            v-model:model-unit="form.subdomain_allocation_settings.defaultQuotaPerUserUnit"
            v-model:model-value="form.subdomain_allocation_settings.defaultQuotaPerUser"
            v-model:model-default-quota="personalSpaceQuotaPerUser"
            v-model:model-default-value="form.subdomain_allocation_settings.defaultQuotaPerUser"
            v-model:model-default-unit="form.subdomain_allocation_settings.defaultQuotaPerUserUnit"
            class="input"
            :label="$t('QUOTA.DEFAULT_ALLOCATED_QUOTA_PER_USER')"
            :note="$t('QUOTA.CANNOT_EXCEED_ALLOCATED_DOMAIN_QUOTA')"
          ></quota-input>
          <span v-if="personalSpaceQuotaPerUserLogic()" class="input-logic-alert">{{
            `${t('QUOTA.ERROR_MESSAGE_FIELD')}  ${personalQuotaPerUserAlert}`
          }}</span>
          <quota-input
            v-model:model-unit="form.subdomain_allocation_settings.defaultPersonalQuotaMaxFileSizeUnit"
            v-model:model-value="form.subdomain_allocation_settings.defaultPersonalQuotaMaxFileSize"
            v-model:model-default-quota="personalSpaceMaxSize"
            v-model:model-default-value="form.subdomain_allocation_settings.defaultPersonalQuotaMaxFileSize"
            v-model:model-default-unit="form.subdomain_allocation_settings.defaultPersonalQuotaMaxFileSizeUnit"
            class="input"
            :label="$t('QUOTA.DEFAULT_MAX_FILE_SIZE')"
            :note="$t('QUOTA.CANNOT_EXCEED_ALLOCATED_DOMAIN_QUOTA')"
          ></quota-input>
          <span v-if="personalSpaceMaxSizeLogic()" class="input-logic-alert">{{
            `${t('QUOTA.ERROR_MESSAGE_FIELD')}  ${personalQuotaMaxSizeAlert}`
          }}</span>
          <div class="horizontal-line"></div>
          <span class="section-title">{{ $t('QUOTA.SHARED_SPACE_QUOTA') }}</span>
          <quota-input
            v-model:model-unit="form.subdomain_allocation_settings.defaultTotalAllocatedQuotaUnit"
            v-model:model-value="form.subdomain_allocation_settings.defaultTotalAllocatedQuota"
            class="input"
            :label="$t('QUOTA.DEFAULT_TOTAL_ALLOCATED_QUOTA')"
          ></quota-input>
          <quota-input
            v-model:model-unit="form.subdomain_allocation_settings.defaultSharedspaceQuotaMaxFileSizeUnit"
            v-model:model-value="form.subdomain_allocation_settings.defaultSharedspaceQuotaMaxFileSize"
            class="input"
            :label="$t('QUOTA.DEFAULT_MAX_FILE_SIZE')"
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
import { useDomainStore } from '@/modules/domain/store';
import useQuota from '@/modules/configuration/pages/quota/hooks/useQuota';
import { PlusCircleOutlined } from '@ant-design/icons-vue';
import Collapse from '@/core/components/ls/ls-collapse.vue';
import CollapsePanel from '@/core/components/ls/ls-collapse-panel.vue';
import QuotaVisualizeCard from '@/modules/configuration/pages/quota/components/quota-visualize.vue';
import QuotaInput from '@/modules/configuration/pages/quota/components/quota-input.vue';
import { byteTo, displayUnit, find, toByte } from '@/core/utils/unitStorage';

const { t } = useI18n();
const domainStore = useDomainStore();
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
  return displayUnit(byteTo, domainQuotaInformations.quota, undefined);
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
