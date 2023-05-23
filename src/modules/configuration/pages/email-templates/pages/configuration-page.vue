<template>
  <div class="email-templates-configuration-page">
    <a-alert closable class="email-templates-configuration-page__help-text">
      <template #description>
        <ul>
          <li v-html="$t('EMAIL_TEMPLATES.CONFIGURATION_PAGE.MAIL_LAYOUT_DESCRIPTION')"></li>
          <li v-html="$t('EMAIL_TEMPLATES.CONFIGURATION_PAGE.MAIL_FOOTER_DESCRIPTION')"></li>
          <li v-html="$t('EMAIL_TEMPLATES.CONFIGURATION_PAGE.MAIL_CONTENT_DESCRIPTION')"></li>
        </ul>
        {{ $t('EMAIL_TEMPLATES.CONFIGURATION_PAGE.MAIL_ASSIGN_DESCRIPTION') }}
      </template>
    </a-alert>
    <div class="email-templates-configuration-page__action">
      <a-input
        v-model:value="filterText"
        :placeholder="$t('GENERAL.SEARCH_BY_NAME')"
        class="email-templates-configuration-page__action-input"
        allow-clear
      >
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input>
      <mail-configuration-actions @create="onCreateMailConfiguration"></mail-configuration-actions>
    </div>
    <MailConfigurationTable></MailConfigurationTable>
    <ThePagination v-model="pagination" class="pagination" :is-visible="!!filteredList.length" />
  </div>
  <a-modal
    v-model:visible="modal.visible"
    :closable="false"
    :footer="null"
    :destroy-on-close="true"
    wrap-class-name="email-templates-configuration-page__modal"
  >
    <create-mail-configuration-card
      v-if="modal.type === 'CREATE_CONFIGURATION_EMAIL'"
      @close="onCloseModal"
      @refresh="onFetchMailConfiguration"
    ></create-mail-configuration-card>
    <AssignMailConfigurationCard
      v-else-if="modal.type === 'ASSIGN_CONFIGURATION_EMAIL'"
      @close="onCloseModal"
      @refresh="assignReload"
    ></AssignMailConfigurationCard>
    <DeleteMailConfigurationCard
      v-else-if="modal.type === 'DELETE_CONFIGURATION_EMAIL'"
      @close="onCloseModal"
      @refresh="assignReload"
    ></DeleteMailConfigurationCard>
    <DeleteMailConfigurationsCard
      v-else-if="modal.type === 'DELETE_CONFIGURATIONS_EMAIL'"
      @close="onCloseModal"
      @refresh="onFetchMailConfiguration"
    ></DeleteMailConfigurationsCard>
    <DeleteMailConfigurationsFailCard
      v-else-if="modal.type === 'DELETE_CONFIGURATIONS_FAIL_EMAIL'"
      @close="onCloseModal"
      @refresh="onFetchMailConfiguration"
    ></DeleteMailConfigurationsFailCard>
  </a-modal>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { watch } from 'vue';
import MailConfigurationTable from '../components/email-configuration/mail-configuration-table.vue';
import CreateMailConfigurationCard from '../components/email-configuration/create-mail-configuration-card.vue';

import ThePagination from '@/core/components/the-pagination.vue';
import { useDomainStore } from '@/modules/domain/store';
import { SearchOutlined } from '@ant-design/icons-vue';
import AssignMailConfigurationCard from '../components/email-configuration/assign-mail-configuration-card.vue';
import DeleteMailConfigurationCard from '../components/email-configuration/delete-mail-configuration-card.vue';
import DeleteMailConfigurationsCard from '../components/email-configuration/delete-mail-configurations-card.vue';
import DeleteMailConfigurationsFailCard from '../components/email-configuration/delete-mail-configurations-fail-card.vue';
import useEmailTemplatesConfiguration from '../hooks/useEmailTemplatesConfiguration';
import MailConfigurationActions from '../components/email-configuration/mail-configuration-actions.vue';
const {
  modal,
  filterText,
  pagination,
  filteredList,
  onCloseModal,
  fetchMailConfiguration,
  onCreateMailConfiguration,
  resetSelectEmailConfiguration,
} = useEmailTemplatesConfiguration();
const route = useRoute();
const domainStore = useDomainStore();

async function onFetchMailConfiguration() {
  await fetchMailConfiguration();
  resetSelectEmailConfiguration();
}

function assignReload() {
  domainStore.fetchDomain();
}

onFetchMailConfiguration();

watch(route, (newRoute) => {
  if (newRoute) {
    onFetchMailConfiguration();
  }
});
</script>

<style lang="less">
.email-templates-configuration-page {
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

  &__action {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
  }

  &__action-input {
    width: 375px;
  }

  &__action-switch {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    white-space: nowrap;
    gap: 4px;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: -0.02em;
    color: #434657;
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
