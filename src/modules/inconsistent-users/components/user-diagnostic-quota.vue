<template>
  <hr class="bar" />
  <h3>{{ $t('INCONSISTENT_USERS.MIGRATE_USERS_CARD.QUOTA SETTING') }}</h3>
  <div class="quoto-informations">
    <div class="quota-input">
      <a-spin v-if="quotaLoading" class="load-spinner"></a-spin>
      <div v-else>
        <quota-input
          v-model:model-unit="quotasUnits.personalAllocatedQuotaUnit"
          v-model:model-value="userDiagnosticQuotaInformations.quota"
          v-model:model-override="userDiagnosticQuotaInformations.quotaOverride"
          :default-quota="defaultPersonalQuota"
          :default-value="userDiagnosticQuotaInformations.defaultQuota"
          :default-unit="quotasUnits.defaultPersonalAllocatedQuotaUnit"
          :label="$t('INCONSISTENT_USERS.MIGRATE_USERS_CARD.PERSONAL_SPACE_QUOTA')"
          :override-mode="true"
          :disabled="!userDiagnosticQuotaInformations.quotaOverride"
          class="inline-block"
        ></quota-input>
        <a-spin v-if="quotaLoading"></a-spin>
        <quota-input
          v-model:model-unit="quotasUnits.maxFileSizeUnit"
          v-model:model-value="userDiagnosticQuotaInformations.maxFileSize"
          v-model:model-override="userDiagnosticQuotaInformations.maxFileSizeOverride"
          :default-quota="defaultMaxFileQuota"
          :default-value="userDiagnosticQuotaInformations.defaultMaxFileSize"
          :default-unit="quotasUnits.defaultMaxFileSizeUnit"
          :label="$t('INCONSISTENT_USERS.MIGRATE_USERS_CARD.MAX_SIZE_QUOTA')"
          :override-mode="true"
          :disabled="!userDiagnosticQuotaInformations.maxFileSizeOverride"
          class="inline-block"
        ></quota-input>
      </div>

      <span v-if="maxQuotaLogic()" class="check-wrong">{{ $t('QUOTA.DOMAIN_MAXIMUM_QUOTA') }} {{ maximumQuota }}</span>
    </div>
    <div class="quota-visualization">
      <quota-visualize-card :items="quotaVisualizeCardItems"></quota-visualize-card>
    </div>
  </div>
  <div class="actions">
    <a-button v-if="quotaLoading" class="ls-button">
      <a-spin></a-spin>
    </a-button>
    <a-button v-else type="primary" class="ls-button" @click="saveQuotaInformations(userDiagnosticQuotaInformations)">
      <span>{{ $t('GENERAL.SAVE') }}</span>
    </a-button>
    <a-button class="ls-button ls-reset" @click="resetQuota">
      {{ $t('GENERAL.RESET') }}
    </a-button>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import QuotaInput from '@/modules/configuration/pages/quota/components/quota-input.vue';
import QuotaVisualizeCard from '@/modules/configuration/pages/quota/components/quota-visualize.vue';
import { useI18n } from 'vue-i18n';
import useUsersDiagnostic from '@/modules/inconsistent-users/hooks/useUsersDiagnostic';
import { byteTo, displayUnit, find, toByte } from '@/core/utils/unitStorage';

const { t } = useI18n();
const {
  userDiagnosticQuotaInformations,
  quotasUnits,
  getDiagnosticUserQuotaInformations,
  maxQuotaLogic,
  saveQuotaInformations,
  quotaLoading,
} = useUsersDiagnostic();

const maximumQuota = computed(() => {
  const value = toByte(userDiagnosticQuotaInformations.value.quota, quotasUnits.personalAllocatedQuotaUnit);
  return displayUnit(byteTo, value, undefined);
});

const defaultPersonalQuota = computed(() => {
  const value = toByte(
    userDiagnosticQuotaInformations.value.defaultQuota,
    quotasUnits.defaultPersonalAllocatedQuotaUnit
  );
  return displayUnit(byteTo, value, undefined);
});

const defaultMaxFileQuota = computed(() => {
  const value = toByte(userDiagnosticQuotaInformations.value.defaultMaxFileSize, quotasUnits.defaultMaxFileSizeUnit);
  return displayUnit(byteTo, value, undefined);
});

const quotaVisualizeCardItems = computed(() => {
  const quotaItems = [
    {
      name: t('INCONSISTENT_USERS.MIGRATE_USERS_CARD.USED_QUOTA'),
      value: userDiagnosticQuotaInformations.value.usedSpace,
      color: '#007AFF',
    },
  ];

  quotaItems.push({
    name: t('INCONSISTENT_USERS.MIGRATE_USERS_CARD.REMAINING_QUOTA'),
    value: toByte(
      toByte(userDiagnosticQuotaInformations.value.quota, quotasUnits.personalAllocatedQuotaUnit) -
        userDiagnosticQuotaInformations.value.usedSpace,
      'B'
    ),
    color: '#30CD60',
  });

  return quotaItems;
});

async function getQuotaData() {
  await getDiagnosticUserQuotaInformations();
}

async function resetQuota() {
  quotasUnits.personalAllocatedQuotaUnit = 'GB';
  quotasUnits.maxFileSizeUnit = 'GB';
  await getDiagnosticUserQuotaInformations();
}

getQuotaData();
</script>

<style lang="less" scoped>
.quoto-informations {
  display: flex;
  flex-direction: row;
}

.quota-input {
  display: flex;
  flex-direction: column;
  width: 60%;
  margin-right: 30px;
}

.inline-block {
  display: inline-block;
  margin-bottom: 30px;
}

.bar {
  border: none;
  border-top: 1px solid #e4e5f0;
  width: 100%;
  margin-top: 15px;
  margin-bottom: 30px;
}

.check-wrong {
  color: red;
  font-weight: bold;
}

.actions {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
  margin-top: 20px;

  .ls-button {
    padding: 0px 20px;
    min-width: 88px;
    height: 44px;
    border-radius: 8px;
  }

  .ls-filled {
    background-color: #007aff;
    color: #f3f3f7;

    .ant-spin {
      color: #f3f3f7;
    }

    .ant-spin-dot-item {
      background-color: #f3f3f7;
    }
  }

  .ls-reset {
    color: #ea3c3c;
  }
}

.load-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50%;
}
</style>
