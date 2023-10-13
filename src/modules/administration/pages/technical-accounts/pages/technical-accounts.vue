<template>
  <div class="technical-accounts">
    <the-subheader :title="$t('NAVIGATOR.ADMINISTRATION')" :detail="$t('ADMINISTRATION.INTRODUCTION')" class="header">
    </the-subheader>
    <PageTitle :title="$t('TECHNICAL_ACCOUNTS.PAGE_TITLE')">
      <template #helperContent>
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
    </PageTitle>
    <a-breadcrumb class="breakcrumb" :routes="breadcrumbsWithDomain">
      <template #itemRender="{ route, routes }">
        <span v-if="routes.indexOf(route) === routes.length - 1" class="current">
          {{ $t(route.label) }}
        </span>

        <router-link v-else :to="{ name: route.path, params: route?.params }">
          {{ $t(route.label) }}
        </router-link>
      </template>
    </a-breadcrumb>
    <TechnicalAccountTable />
  </div>
  <ThePagination v-model="pagination" :is-visible="!!filteredList.length" />
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import TechnicalAccountTable from '../components/technical-accounts-table.vue';
import PageTitle from '@/core/components/page-title.vue';
import ThePagination from '@/core/components/the-pagination.vue';
import TheSubheader from '@/core/components/the-subheader.vue';
import useTechnicalAccount from '../hooks/useTechnicalAccount';

const { pagination, filteredList } = useTechnicalAccount();

const breadcrumbsWithDomain = computed(() => {
  const newBreadcrumbs = [
    {
      label: 'NAVIGATOR.ADMINISTRATION',
      path: 'Administration',
    },
    {
      label: 'ADMINISTRATION.NAVIGATOR.TECHNICAL_ACCOUNTS',
      path: 'administration/technical-accounts',
    },
  ];
  return newBreadcrumbs;
});

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

.header {
  border-radius: 12px;
}
</style>
