<template>
  <div class="configuration-detail-page">
    <div class="configuration-detail-page__title">
      <email-configuration-detail-header
        :editable="allowEdit"
        :editing="editing"
        @edit-toggle="onToggleEditState"
      ></email-configuration-detail-header>
    </div>
    <div class="configuration-detail-page__body">
      <div class="configuration-detail-page__body-summary">
        <div class="configuration-detail-page__body-summary-config">
          <email-configuration-detail-card
            :editable="allowEdit"
            :editing="editing"
            :layouts="list"
            :footers="footerList"
            @refresh="onFetchingEmailConfig"
          ></email-configuration-detail-card>
          <!-- Top left section (email configuration) -->
        </div>
        <div class="configuration-detail-page__body-summary-system">
          <system-information-card :item="activeMailConfig"></system-information-card>
          <!-- Top right section (system information) -->
        </div>
      </div>
      <div class="configuration-detail-page__body-table">
        <!-- Bottom table -->
        <email-configuration-content-table
          :editable="allowEdit"
          :editing="editing"
          @refresh="onFetchingEmailConfig"
        ></email-configuration-content-table>
      </div>
    </div>
  </div>
  <div class="configuration-detail-page__action">
    <email-configuration-detail-action
      :editable="allowEdit"
      :editing="editing"
      :loading="loading"
      @cancel="onToggleEditState"
      @save="onUpdateEmailConfiguration"
      @reset="onResetEmailConfiguration"
    ></email-configuration-detail-action>
  </div>
</template>
<script lang="ts" setup>
import EmailConfigurationDetailHeader from '@/modules/configuration/pages/email-templates/components/email-configuration/detail-page/email-configuration-detail-header.vue';
import EmailConfigurationDetailAction from '@/modules/configuration/pages/email-templates/components/email-configuration/detail-page/email-configuration-detail-action.vue';
import SystemInformationCard from '@/modules/configuration/pages/email-templates/components/email-configuration/detail-page/system-information-card.vue';
import EmailConfigurationDetailCard from '@/modules/configuration/pages/email-templates/components/email-configuration/detail-page/email-configuration-detail-card.vue';
import EmailConfigurationContentTable from '@/modules/configuration/pages/email-templates/components/email-configuration/detail-page/email-configuration-content-table.vue';

import { computed, onMounted, ref, watch } from 'vue';
import useEmailTemplatesConfiguration from '../hooks/useEmailTemplatesConfiguration';
import useEmailTemplatesLayout from '../hooks/useEmailTemplatesLayout';
import { MailConfiguration } from '../types/MailConfiguration';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/modules/auth/store';
import { ACCOUNT_ROLE } from '@/modules/user/types/User';
import { useRoute } from 'vue-router';

// composables
const route = useRoute();
const {
  loading,
  activeMailConfig,
  activeEmailConfigForm,
  mailFooterLangsForm,
  handleGetMailConfigurationDetail,
  handleUpdateMailConfiguration,
  handleResetEmailConfiguration,
  onCheckDefaultEmailConfiguration,
  footerList,
  handleGetEmailFooterTemplates,
} = useEmailTemplatesConfiguration();
const { list, handleGetEmailLayoutTemplates } = useEmailTemplatesLayout();
const { loggedUserRole } = storeToRefs(useAuthStore());

// data
const editing = ref(false);

//computed

const isSuperAdmin = computed(() => {
  return loggedUserRole.value === ACCOUNT_ROLE.SUPERADMIN;
});
const allowEdit = computed(() => {
  return isSuperAdmin.value || (!onCheckDefaultEmailConfiguration(activeMailConfig.value) && !hasRootDomain());
});
// methods

function hasRootDomain() {
  return activeMailConfig.value.domain === 'LinShareRootDomain';
}

function onToggleEditState() {
  editing.value = !editing.value;
}

async function onUpdateEmailConfiguration() {
  const payload: MailConfiguration = {
    ...activeMailConfig.value,
    ...activeEmailConfigForm.value,
    mailFooterLangs: { ...mailFooterLangsForm.value },
  };
  delete payload.selectLanguage;
  await handleUpdateMailConfiguration(payload);
  onToggleEditState();
}

function onResetEmailConfiguration() {
  handleResetEmailConfiguration();
}

function onFetchingData() {
  handleGetMailConfigurationDetail(route.params.id?.toString());
  handleGetEmailLayoutTemplates(activeMailConfig?.value?.domain, false);
  handleGetEmailFooterTemplates(activeMailConfig?.value?.uuid);
}

function onFetchingEmailConfig() {
  handleGetMailConfigurationDetail(activeMailConfig?.value?.uuid);
}

watch(
  () => route.fullPath,
  () => {
    if (route.params.id?.toString()) {
      onFetchingData();
    }
  },
  {
    immediate: true,
  }
);
</script>

<style lang="less">
.configuration-detail-page {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 16px;

  &__help-text {
    padding: 12px 24px 12px 16px;
    gap: 6px;
    background: #f2f8ff;
    border-radius: 8px;
    border: none;

    ul {
      list-style: none;
    }

    ul li::before {
      content: '\2022';
      color: #007aff;
      font-weight: bold;
      display: inline-block;
      width: 1em;
      margin-left: -1em;
    }
  }

  &__title {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
    width: 100%;
  }

  &__modal .ant-modal-content {
    background: #ffffff;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.08), 0px 8px 8px rgba(0, 0, 0, 0.16);
    border-radius: 16px;
    overflow: hidden;
  }

  &__modal .ant-modal-body {
    padding: 0;
  }

  &__body {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }

  &__body-summary {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    gap: 24px;
  }

  &__body-summary-config {
    width: 50%;
  }

  &__body-summary-system {
    width: 50%;
  }

  &__body-table {
    width: 100%;
    margin-top: 20px;
  }

  &__action {
    width: 100%;
  }
}

.ls-detail {
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f2f8ff;
  border: 1px solid #a3dcff;
  color: #007aff;
  border-radius: 7px;
  transform: rotate(90deg);
}
</style>
