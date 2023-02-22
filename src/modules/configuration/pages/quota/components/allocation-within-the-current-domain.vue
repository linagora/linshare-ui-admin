<template>
  <collapse>
    <collapse-panel :key="1" :header="$t('QUOTA.ALLOCATION_WITHIN_THE_CURRENT_DOMAIN')">
      <a-alert
        type="info"
        class="ls-alert ls-no-border allocation-within-the-current-domain__alert"
        :show-icon="false"
        closable
      >
        <template #message>
          {{ $t('QUOTA.QUOTA_IN_DOMAIN_IS_MANAGED_BY_CONTAINERS') }}
          <ul>
            <li>{{ $t('QUOTA.PERSONAL_SPACE_MANAGE_THE_ALLOCATED_SPACE_FOR_ALL_USERS_SPACE') }}</li>
            <li>{{ $t('QUOTA.SHAREDSPACE_MANAGE_THE_ALLOCATED_SPACE_FOR_ALL_SHAREDSPACE') }}</li>
          </ul>
        </template>
      </a-alert>
      <div class="allocation-within-the-current-domain">
        <div class="allocation-within-the-current-domain__block">
          <strong class="allocation-within-the-current-domain__block-title">{{
            $t(`QUOTA.PERSONAL SPACE QUOTA`)
          }}</strong>
          <div class="maintenance-mode">
            <a-switch v-model:checked="form.allocationWithinTheCurrentDomain.maintenance" class="maintenance-switch" />
            <span>{{ $t('QUOTA.MAINTENANCE_MODE') }}</span>
          </div>
          <ls-alert
            v-if="form.allocationWithinTheCurrentDomain.maintenance"
            :message="$t('QUOTA.MAINTENANCE_MODE_ACTIVATED_ALERT')"
            type="warning"
            :border="true"
            :show-icon="false"
          ></ls-alert>
          <div class="allocation-within-the-current-domain__block-body">
            <div class="allocation-within-the-current-domain__form">
              <div class="allocation-within-the-current-domain__form-row">
                <quota-input
                  v-model:model-unit="form.allocationWithinTheCurrentDomain.quotaUnit"
                  v-model:model-value="form.allocationWithinTheCurrentDomain.quota"
                  v-model:model-override="form.allocationWithinTheCurrentDomain.quotaOverride"
                  :label="$t('QUOTA.TOTAL_PERSONAL_SPACES_ALLOCATED_QUOTA')"
                  :default-quota="defaultQuota"
                  :default-value="defaultQuotaValue"
                  :default-unit="defaultQuotaUnit"
                  :hint="hintQuota"
                  :override-mode="overrideMode"
                  :disabled="disabledPersonalSpaceQuotaInput || form.domainQuotaAndUsedSpace.domainShared"
                  :lock-disabled="form.domainQuotaAndUsedSpace.domainShared"
                ></quota-input>
                <span v-if="defaultAllocatedMaxQuotaLogic()" class="save-check-wrong">{{
                  `${t('QUOTA.ERROR_MESSAGE_FIELD')}  ${maximumQuota}`
                }}</span>
              </div>
              <div class="allocation-within-the-current-domain__form-row">
                <quota-input
                  v-model:model-unit="form.allocationWithinTheCurrentDomain.accountQuotaUnit"
                  v-model:model-value="form.allocationWithinTheCurrentDomain.accountQuota"
                  v-model:model-override="form.allocationWithinTheCurrentDomain.accountQuotaOverride"
                  :label="$t('QUOTA.PERSONAL_SPACES_ALLOCATED_QUOTA')"
                  :default-quota="defaultPersonalSpaceQuota"
                  :default-value="defaultPersonalSpaceQuotaValue"
                  :default-unit="defaultPersonalSpaceQuotaUnit"
                  :override-mode="overrideMode"
                  :disabled="disabledPersonalSpaceAccountQuotaInput || form.domainQuotaAndUsedSpace.domainShared"
                  :lock-disabled="form.domainQuotaAndUsedSpace.domainShared"
                ></quota-input>
                <span v-if="personalAllocatedQuotaLogic()" class="save-check-wrong">{{
                  `${t('QUOTA.ERROR_MESSAGE_FIELD')}  ${personalAllocatedQuotaAlert}`
                }}</span>
              </div>
              <div class="allocation-within-the-current-domain__form-row">
                <quota-input
                  v-model:model-unit="form.allocationWithinTheCurrentDomain.maxFileSizeUnit"
                  v-model:model-value="form.allocationWithinTheCurrentDomain.maxFileSize"
                  v-model:model-override="form.allocationWithinTheCurrentDomain.maxFileSizeOverride"
                  :label="$t('QUOTA.PERSONAL_SPACES_MAX_FILE_SIZE')"
                  :default-quota="defaultPersonalSpaceQuotaMaxFileSize"
                  :default-value="defaultPersonalSpaceQuotaMaxFileSizeValue"
                  :default-unit="defaultPersonalSpaceQuotaMaxFileSizeUnit"
                  :override-mode="overrideMode"
                  :disabled="disabledPersonalSpaceDefaultMaxFileSizeInput"
                ></quota-input>
                <span v-if="personalAllocatedMaxFileSizeLogic()" class="save-check-wrong">{{
                  `${t('QUOTA.ERROR_MESSAGE_FIELD')}  ${personalAllocatedMaxFileSizeAlert}`
                }}</span>
              </div>
              <div class="allocation-within-the-current-domain__form-row">
                <router-link :to="{ name: 'UsersList' }">
                  <span>{{ $t('QUOTA.ALLOCAED_QUOTA_SPECIFIC_USER_ACCOUNT') }} <PlusCircleOutlined /></span>
                </router-link>
              </div>
              <div class="allocation-within-the-current-domain__form-row"></div>
            </div>
            <div class="allocation-within-the-current-domain__chart">
              <quota-visualize-card :items="personalSpaceVisualizeCardItems"></quota-visualize-card>
            </div>
          </div>
        </div>
        <div class="allocation-within-the-current-domain__block">
          <strong class="allocation-within-the-current-domain__block-title">{{ $t(`QUOTA.SHAREDSPACE_QUOTA`) }}</strong>
          <div class="maintenance-mode">
            <a-switch
              v-model:checked="form.allocationWithinTheCurrentDomain.sharedSpaceMaintenance"
              class="maintenance-switch"
            />
            <span>{{ $t('QUOTA.MAINTENANCE_MODE') }}</span>
          </div>
          <ls-alert
            v-if="form.allocationWithinTheCurrentDomain.sharedSpaceMaintenance"
            :message="$t('QUOTA.MAINTENANCE_MODE_ACTIVATED_ALERT')"
            type="warning"
            :border="true"
            :show-icon="false"
          ></ls-alert>
          <div class="allocation-within-the-current-domain__block-body">
            <div class="allocation-within-the-current-domain__form">
              <div class="allocation-within-the-current-domain__form-row">
                <quota-input
                  v-model:model-unit="
                    form.subdomainAllocationSettings.personalSpacesAllocatedQuotaForAllPersonalSpacesUnit
                  "
                  v-model:model-value="
                    form.subdomainAllocationSettings.personalSpacesAllocatedQuotaForAllPersonalSpaces
                  "
                  v-model:model-override="form.allocationWithinTheCurrentDomain.sharedSpaceAllocatedOverride"
                  :label="$t('QUOTA.TOTAL_SHAREDSPACE_ALLOCATED_QUOTA')"
                  :default-quota="defaultTotalSharedSpaceAllocatedQuota"
                  :default-value="defaultTotalSharedSpaceAllocatedQuotaValue"
                  :default-unit="defaultTotalSharedSpaceAllocatedQuotaUnit"
                  :hint="hintSharedSpaceAllocatedQuota"
                  :override-mode="overrideMode"
                  :disabled="disabledSharedSpaceQuotaInput || form.domainQuotaAndUsedSpace.domainShared"
                  :lock-disabled="form.domainQuotaAndUsedSpace.domainShared"
                ></quota-input>
                <span v-if="totalSharedSpaceAllocatedQuotaLogic()" class="save-check-wrong">{{
                  `${t('QUOTA.ERROR_MESSAGE_FIELD')}  ${maximumQuota}`
                }}</span>
              </div>
              <div class="allocation-within-the-current-domain__form-row">
                <quota-input
                  v-model:model-unit="form.subdomainAllocationSettings.sharedSpaceMaxFileSizeQuotaUnit"
                  v-model:model-value="form.subdomainAllocationSettings.sharedSpaceMaxFileSizeQuota"
                  v-model:model-override="form.subdomainAllocationSettings.maxFileSizeOverride"
                  :label="$t('QUOTA.SHAREDSPACE_MAX_FILE_SIZE')"
                  :default-quota="defaultTotalSharedSpaceAllocatedQuotaMaxSize"
                  :default-value="defaultTotalSharedSpaceAllocatedQuotaMaxSizeValue"
                  :default-unit="defaultTotalSharedSpaceAllocatedQuotaMaxSizeUnit"
                  :override-mode="overrideMode"
                  :disabled="disabledSharedSpaceMaxFieSizeInput"
                ></quota-input>
                <span v-if="sharedSpaceMaxFileSizeLogic()" class="save-check-wrong">{{
                  `${t('QUOTA.ERROR_MESSAGE_FIELD')}  ${sharedSpaceMaxFileSizeAlert}`
                }}</span>
              </div>
            </div>
            <div class="allocation-within-the-current-domain__chart">
              <quota-visualize-card :items="allocatedPersonalSpaceVisualizeCardItems"></quota-visualize-card>
            </div>
          </div>
        </div>
        <div class="allocation-within-the-current-domain__block">
          <strong class="allocation-within-the-current-domain__block-title">{{
            $t(`QUOTA.CONTRAINERS_VIRTUAL_ALLOCATION`)
          }}</strong>
          <div class="allocation-within-the-current-domain__block-body">
            <div class="allocation-within-the-current-domain__chart">
              <quota-visualize-card :items="personalSpaceRemainingVisualizeCardItems"></quota-visualize-card>
            </div>
          </div>
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
import { PlusCircleOutlined } from '@ant-design/icons-vue';
import Collapse from '@/core/components/ls/ls-collapse.vue';
import { byteTo, displayUnit, find, toByte } from '@/core/utils/unitStorage';
import CollapsePanel from '@/core/components/ls/ls-collapse-panel.vue';
import useQuota from '@/modules/configuration/pages/quota/hooks/useQuota';
import QuotaInput from '@/modules/configuration/pages/quota/components/quota-input.vue';
import QuotaVisualizeCard from '@/modules/configuration/pages/quota/components/quota-visualize.vue';
import useDomainDelete from '@/modules/domain/hooks/useDomainDelete';
import LsAlert from '@/core/components/ls/ls-alert.vue';

// composable
const { t } = useI18n();
const domainStore = useDomainStore();
const { canDelete } = useDomainDelete();
const { isRootDomain } = storeToRefs(domainStore);
const {
  form,
  domainQuotaInformations,
  allocationContainerInformations,
  parentSubdomainInformations,
  parentAllocationInformations,
  subdomainContainerInformations,
  defaultAllocatedMaxQuotaLogic,
  personalAllocatedQuotaLogic,
  personalAllocatedMaxFileSizeLogic,
  totalSharedSpaceAllocatedQuotaLogic,
  sharedSpaceMaxFileSizeLogic,
} = useQuota();

// computed
const disabledPersonalSpaceQuotaInput = computed(() => {
  return !form.allocationWithinTheCurrentDomain?.quotaOverride && !isRootDomain.value;
});

const disabledPersonalSpaceAccountQuotaInput = computed(() => {
  return !form.allocationWithinTheCurrentDomain?.accountQuotaOverride && !isRootDomain.value;
});

const disabledPersonalSpaceDefaultMaxFileSizeInput = computed(() => {
  return !form.allocationWithinTheCurrentDomain?.maxFileSizeOverride && !isRootDomain.value;
});

const disabledSharedSpaceQuotaInput = computed(() => {
  return !form.allocationWithinTheCurrentDomain?.sharedSpaceAllocatedOverride && !isRootDomain.value;
});

const disabledSharedSpaceMaxFieSizeInput = computed(() => {
  return !form.subdomainAllocationSettings.maxFileSizeOverride && !isRootDomain.value;
});

const overrideMode = computed(() => {
  return !isRootDomain.value && canDelete.value;
});

const defaultQuotaValue = computed(() => {
  return byteTo(parentAllocationInformations.defaultQuota, undefined);
});

const defaultQuotaUnit = computed(() => {
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

const defaultQuota = computed(() => {
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

//#region share space visuallize

const sharedSpaceRemainingQuota = computed(() => {
  return toByte(
    form.subdomainAllocationSettings.personalSpacesAllocatedQuotaForAllPersonalSpaces,
    form.subdomainAllocationSettings.personalSpacesAllocatedQuotaForAllPersonalSpacesUnit
  );
});

const sharedSpaceUnaloocatedSpace = computed(() => {
  return (
    domainQuotaInformations.quota -
    toByte(
      form.subdomainAllocationSettings.personalSpacesAllocatedQuotaForAllPersonalSpaces,
      form.subdomainAllocationSettings.personalSpacesAllocatedQuotaForAllPersonalSpacesUnit
    )
  );
});

//#endregion

//#region personal space visuallize
const personalSpaceRemainingQuota = computed(() => {
  return (
    toByte(form.allocationWithinTheCurrentDomain.quota, form.allocationWithinTheCurrentDomain.quotaUnit) -
    allocationContainerInformations.usedSpace
  );
});

const personalSpaceUnAllocatedQuota = computed(() => {
  return (
    domainQuotaInformations.quota -
    toByte(form.allocationWithinTheCurrentDomain.quota, form.allocationWithinTheCurrentDomain.quotaUnit)
  );
});

const virtualUnallocatedSpace = computed(() => {
  return sharedSpaceUnaloocatedSpace.value + personalSpaceUnAllocatedQuota.value;
});
//#endregion

const hintSharedSpaceAllocatedQuota = computed(() => {
  const sharedSpaceQuotaUnit = toByte(
    form.subdomainAllocationSettings.personalSpacesAllocatedQuotaForAllPersonalSpaces,
    form.subdomainAllocationSettings.personalSpacesAllocatedQuotaForAllPersonalSpacesUnit
  );
  return `${displayUnit(byteTo, allocationContainerInformations.usedSpace, undefined)}/${displayUnit(
    byteTo,
    sharedSpaceQuotaUnit,
    undefined
  )} ${t('QUOTA.ALREADY_USED')} (${(
    (allocationContainerInformations.usedSpace /
      form.subdomainAllocationSettings.personalSpacesAllocatedQuotaForAllPersonalSpaces) *
    100
  ).toFixed(1)}%)`;
});

const hintQuota = computed(() => {
  const quotaUnit = toByte(
    form.allocationWithinTheCurrentDomain.quota,
    form.allocationWithinTheCurrentDomain.quotaUnit
  );
  return `${displayUnit(byteTo, allocationContainerInformations.usedSpace, undefined)}/${displayUnit(
    byteTo,
    quotaUnit,
    undefined
  )} ${t('QUOTA.ALREADY_USED')} (${(
    (allocationContainerInformations.usedSpace / form.allocationWithinTheCurrentDomain.quota) *
    100
  ).toFixed(1)}%)`;
});

const maximumQuota = computed(() => {
  const value = toByte(form.domainQuotaAndUsedSpace.quotaSpace, form.domainQuotaAndUsedSpace.quotaUnit);
  return displayUnit(byteTo, value, undefined);
});

const personalAllocatedQuotaAlert = computed(() => {
  const value = toByte(form.allocationWithinTheCurrentDomain.quota, form.allocationWithinTheCurrentDomain.quotaUnit);
  return displayUnit(byteTo, value, undefined);
});

const personalAllocatedMaxFileSizeAlert = computed(() => {
  const value = toByte(
    form.allocationWithinTheCurrentDomain.accountQuota,
    form.allocationWithinTheCurrentDomain.accountQuotaUnit
  );
  return displayUnit(byteTo, value, undefined);
});

const sharedSpaceMaxFileSizeAlert = computed(() => {
  const value = toByte(
    form.subdomainAllocationSettings.personalSpacesAllocatedQuotaForAllPersonalSpaces,
    form.subdomainAllocationSettings.personalSpacesAllocatedQuotaForAllPersonalSpacesUnit
  );
  return displayUnit(byteTo, value, undefined);
});

const personalSpaceVisualizeCardItems = computed(() => {
  const quotaItems = [
    {
      name: t('QUOTA.TOP_DOMAIN_QUOTA.USED'),
      value: allocationContainerInformations.usedSpace,
      color: '#007AFF',
    },
    {
      name: t('QUOTA.TOP_DOMAIN_QUOTA.REMAINING_QUOTA'),
      value: personalSpaceRemainingQuota.value,
      color: '#FFA940',
    },
    {
      name: t('QUOTA.TOP_DOMAIN_QUOTA.REMAINING_QUOTA'),
      value: personalSpaceUnAllocatedQuota.value,
      color: '#EA3C3C',
    },
  ];

  return quotaItems;
});

const allocatedPersonalSpaceVisualizeCardItems = computed(() => {
  const quotaItems = [
    {
      name: t('QUOTA.TOP_DOMAIN_QUOTA.USED'),
      value: subdomainContainerInformations.usedSpace,
      color: '#007AFF',
    },
    {
      name: t('QUOTA.TOP_DOMAIN_QUOTA.REMAINING_QUOTA'),
      value: sharedSpaceRemainingQuota.value,
      color: '#FFA940',
    },
    {
      name: t('QUOTA.TOP_DOMAIN_QUOTA.REMAINING_QUOTA'),
      value: sharedSpaceUnaloocatedSpace.value,
      color: '#EA3C3C',
    },
  ];
  return quotaItems;
});

const personalSpaceRemainingVisualizeCardItems = computed(() => {
  const quotaItems = [
    {
      name: t('QUOTA.GUEST_DOMAIN_QUOTA.PERSONAL_ALLOCATED_SPACE'),
      value: allocationContainerInformations.quota,
      color: '#007AFF',
    },
    {
      name: t('QUOTA.GUEST_DOMAIN_QUOTA.SHARED_SPACE_ALLOCATED'),
      value: sharedSpaceRemainingQuota.value,
      color: '#FFA940',
    },
    {
      name: t('QUOTA.TOP_DOMAIN_QUOTA.QUOTA_PER_SUB_DOMAIN'),
      value: virtualUnallocatedSpace.value,
      color: '#EA3C3C',
    },
  ];
  return quotaItems;
});
</script>

<style lang="less" scoped>
.allocation-within-the-current-domain__alert {
  ul {
    padding-bottom: 0;
    margin-bottom: 0;
  }
}
.allocation-within-the-current-domain {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  margin-top: 20px;

  &__form {
    max-width: 50%;
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: 20px;
  }

  &__block {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: 20px;
    padding: 32px 0;
    border-bottom: 1px solid #d5d7e0;
  }

  &__block-title {
    font-style: normal;
    font-weight: 500;
    font-size: 15px;
    line-height: 20px;
    display: flex;
    align-items: center;
    color: #434657;
  }

  &__block-body {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 48px;
  }

  &__chart {
    width: 50%;
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
