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
      <a-button type="primary">
        <template #icon>
          <PlusCircleOutlined />
        </template>
        {{ $t('GENERAL.CREATE') }}
      </a-button>
    </div>
    <MailConfigurationTable></MailConfigurationTable>
    <ThePagination v-model="pagination" class="pagination" :is-visible="!!filteredList.length" />
  </div>
  <a-modal
    v-model:visible="assignModal.visible"
    :closable="false"
    :footer="null"
    wrap-class-name="type-mime-policies-page__modal"
  >
    <AssignMailConfigurationCard @close="onCloseAssignModal" @refresh="assignReload"></AssignMailConfigurationCard>
  </a-modal>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { watch } from 'vue';
import MailConfigurationTable from '../components/email-configuration/mail-configuration-table.vue';
import ThePagination from '@/core/components/the-pagination.vue';
import { useDomainStore } from '@/modules/domain/store';
import { PlusCircleOutlined, SearchOutlined } from '@ant-design/icons-vue';
import AssignMailConfigurationCard from '../components/email-configuration/assign-mail-configuration-card.vue';
import useEmailTemplatesConfiguration from '../hooks/useEmailTemplatesConfiguration';

const { filterText, fetchMailConfiguration, pagination, filteredList, onCloseAssignModal, assignModal } =
  useEmailTemplatesConfiguration();
const route = useRoute();
const domainStore = useDomainStore();

async function onFetchMailConfiguration() {
  await fetchMailConfiguration();
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
