<template>
  <div class="technical-accounts">
    <a-alert closable class="technical-accounts__help-text">
      <template #description>
        <div class="alert-message-in-description">
          {{ $t('ADMINISTRATION.NAVIGATOR.TECHNICAL_ACCOUNTS') }}
        </div>
        <div>{{ $t('TECHNICAL_ACCOUNTS.TECHNICAL_ACCOUNTS_HELPER') }}</div>
        <div class="alert-message-in-description">
          {{ $t('TECHNICAL_ACCOUNTS.TECHNICAL_ACCOUNTS_HELPER_DELEGATION') }}<br />
          <a href="http://download.linshare.org"> {{ descriptionLink }}</a>
        </div>
        <div>{{ $t('TECHNICAL_ACCOUNTS.TECHNICAL_ACCOUNTS_HELPER_UPLOAD_PROPOSITION') }}</div>
      </template>
    </a-alert>
    <TechnicalAccountTable />
  </div>
  <ThePagination v-model="pagination" :is-visible="!!filteredList.length" />
  <a-modal
    v-model:visible="modal.visible"
    :closable="false"
    :footer="null"
    :destroy-on-close="true"
    wrap-class-name="email-templates-configuration-page__modal"
  >
    <create-technical-account-card
      v-if="modal.type === 'CREATE_TECHNICAL_ACCOUNT'"
      @close="onCloseModal"
      @refresh="fetchTechnicalUserList"
    ></create-technical-account-card>
  </a-modal>
</template>
<script lang="ts" setup>
import TechnicalAccountTable from '../components/technical-accounts-table.vue';
import ThePagination from '@/core/components/the-pagination.vue';
import useTechnicalAccount from '../hooks/useTechnicalAccount';
import createTechnicalAccountCard from '../components/create-technical-account-card.vue';

const { pagination, filteredList, modal, onCloseModal, fetchTechnicalUserList } = useTechnicalAccount();

const descriptionLink = 'http://download.linshare.org';
</script>
<style lang="less">
.technical-accounts {
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
    content: '\2022';
    display: block;
    margin-left: -1em;
    display: flex;
    flex-direction: row;

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
</style>
