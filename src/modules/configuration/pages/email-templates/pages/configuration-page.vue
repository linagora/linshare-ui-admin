<template>
  <div class="mail-configuration-page">
    <div>
      <a-alert closable class="mail-configuration-page__help-text">
        <template #description>
          <ul>
            <li v-html="$t('EMAIL_TEMPLATES.CONFIGURATION_PAGE.MAIL_LAYOUT_DESCRIPTION')"></li>
            <li v-html="$t('EMAIL_TEMPLATES.CONFIGURATION_PAGE.MAIL_FOOTER_DESCRIPTION')"></li>
            <li v-html="$t('EMAIL_TEMPLATES.CONFIGURATION_PAGE.MAIL_CONTENT_DESCRIPTION')"></li>
          </ul>
          {{ $t('EMAIL_TEMPLATES.CONFIGURATION_PAGE.MAIL_ASSIGN_DESCRIPTION') }}
        </template>
      </a-alert>
    </div>
    <div class="actions">
      <a-input v-model:value="filterText" :placeholder="$t('GENERAL.SEARCH_BY_NAME')" class="searchbox" allow-clear>
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
  </div>
  <MailConfigurationTable></MailConfigurationTable>
  <ThePagination v-model="pagination" class="pagination" :is-visible="!!filteredList.length" />
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
import MailConfigurationTable from '../components/mail-configuration-table.vue';
import ThePagination from '@/core/components/the-pagination.vue';
import { useDomainStore } from '@/modules/domain/store';
import { PlusCircleOutlined, SearchOutlined } from '@ant-design/icons-vue';
import AssignMailConfigurationCard from '../components/assign-mail-configuration-card.vue';
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

<style lang="less" scoped>
.actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  margin-top: 20px;
}

.actions > .searchbox {
  width: 500px;
  margin-right: 10px;
}

.mail-configuration-page {
  background-color: transparent;

  &__help-text.ant-alert-info {
    background: #f2f8ff;
    border-radius: 8px;
    border: none;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: -0.01em;
    color: #6d7885;
  }
}
</style>
