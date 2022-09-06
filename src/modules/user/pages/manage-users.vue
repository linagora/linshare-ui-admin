<template>
  <div class="manage-users">
    <PageTitle
      :title="$t('USERS.MANAGE_USERS.TITLE')"
      :subtitle="$t('USERS.MANAGE_USERS.SUBTITLE')"
      :breadcrumbs="breadcrumbs"
    >
      <template #helperContent>
        <div class="alert-message-in-description">
          {{ $t('NAVIGATOR.USERS') }}
        </div>
        <div>{{ $t('USERS.MANAGE_USERS.DESCRIPTION') }}</div>
        <div class="alert-message-in-description">
          {{ $t('USERS.MANAGE_USERS.OPERATION') }}
        </div>
        <div>{{ $t('USERS.MANAGE_USERS.SEARCH_GUIDE') }}</div>
        <div>{{ $t('USERS.MANAGE_USERS.NAVIGATE_GUIDE') }}</div>
      </template>
    </PageTitle>

    <div class="users-list">
      <TokenInput
        :filters="filterOptions"
        :sorts="sortOptions"
        :placeholder="$t('USERS.TOKEN_INPUT.PLACEHOLDER')"
        @submit="handleSubmit"
        @unmount="reset"
      />
      <div class="users-table">
        <LargeTable v-if="isLargeScreen" />
        <SmallTable v-else />
      </div>

      <ThePagination
        v-model="pagination"
        class="pagination"
        :is-visible="!!list.length"
        @change="() => handleTableChange()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useMediaQuery } from '@vueuse/core';
import useBreadcrumbs from '@/core/hooks/useBreadcrumbs';
import PageTitle from '@/core/components/page-title.vue';
import ThePagination from '@/core/components/the-pagination.vue';
import TokenInput, { TokenSubmitPayload } from '@/core/components/token-input.vue';
import LargeTable from '@/modules/user/components/large-table.vue';
import SmallTable from '@/modules/user/components/small-table.vue';
import useUsersList from '../hooks/useUsersList';
import { useDomainStore } from '@/modules/domain/store';
import { UsersListFilters } from '../types/UsersList';

const { list, pagination, sorter, filters, handleTableChange, reset } = useUsersList();
const { locale, t } = useI18n();
const { breadcrumbs } = useBreadcrumbs();
const isLargeScreen = useMediaQuery('(min-width: 1069px)');
const domainStore = useDomainStore();
const { getDomainsList: domainsList } = storeToRefs(domainStore);

const handleSubmit = async function (options: TokenSubmitPayload<UsersListFilters>) {
  if (options.sort) {
    Object.assign(sorter, options.sort);
  }
  filters.value = options.filters;

  await handleTableChange();
};

const sortOptions = [
  {
    key: 'domain',
    label: 'GENERAL.DOMAIN',
  },
  {
    key: 'firstName',
    label: 'USERS.DETAIL_USER.FIRST_NAME',
  },
  {
    key: 'lastName',
    label: 'USERS.DETAIL_USER.LAST_NAME',
  },
  {
    key: 'mail',
    label: 'USERS.MANAGE_USERS.EMAIL',
  },
  {
    key: 'creationDate',
    label: 'USERS.DETAIL_USER.CREATION_DATE',
  },
  {
    key: 'modificationDate',
    label: 'USERS.DETAIL_USER.MODIFICATION_DATE',
    default: true,
  },
];

const filterOptions = [
  {
    key: 'mail',
    displayKey: computed(() => t('USERS.MANAGE_USERS.EMAIL', locale.value)),
    default: true,
  },
  {
    key: 'firstName',
    displayKey: computed(() => t('USERS.DETAIL_USER.FIRST_NAME', locale.value)),
  },
  {
    key: 'lastName',
    displayKey: computed(() => t('USERS.DETAIL_USER.LAST_NAME', locale.value)),
  },
  {
    key: 'role',
    displayKey: computed(() => t('USERS.DETAIL_USER.ROLE', locale.value)),
    options: [
      {
        value: 'SIMPLE',
        label: computed(() => t('USERS.DETAIL_USER.ROLE_SIMPLE', locale.value)),
      },
      {
        value: 'ADMIN',
        label: computed(() => t('USERS.DETAIL_USER.ROLE_ADMIN', locale.value)),
      },
    ],
  },
  {
    key: 'type',
    displayKey: computed(() => t('USERS.DETAIL_USER.ACCOUNT_TYPE', locale.value)),
    options: [
      {
        value: 'INTERNAL',
        label: computed(() => t('USERS.DETAIL_USER.TYPE_INTERNAL', locale.value)),
      },
      {
        value: 'GUEST',
        label: computed(() => t('USERS.DETAIL_USER.TYPE_GUEST', locale.value)),
      },
    ],
  },
  {
    key: 'canCreateGuest',
    displayKey: computed(() => t('USERS.DETAIL_USER.GUEST_CREATION_RIGHTS', locale.value)),
    options: [
      {
        value: true,
        label: computed(() => t('USERS.DETAIL_USER.YES', locale.value)),
      },
      {
        value: false,
        label: computed(() => t('USERS.DETAIL_USER.NO', locale.value)),
      },
    ],
  },
  {
    key: 'canUpload',
    displayKey: computed(() => t('USERS.DETAIL_USER.UPLOAD_RIGHTS', locale.value)),
    options: [
      {
        value: true,
        label: computed(() => t('USERS.DETAIL_USER.YES', locale.value)),
      },
      {
        value: false,
        label: computed(() => t('USERS.DETAIL_USER.NO', locale.value)),
      },
    ],
  },
  {
    key: 'domain',
    displayKey: computed(() => t('GENERAL.DOMAIN', locale.value)),
    options: domainsList.value.map((domain) => ({
      label: domain.name,
      value: domain.uuid,
    })),
  },
];
</script>

<style lang="less" scoped>
.manage-users {
  .users-list {
    margin-top: 30px;

    .pagination {
      margin-top: 30px;
    }
  }

  .alert-message-in-description {
    display: block;
    margin-top: 10px;
    margin-bottom: 4px;
    font-size: 16px;
  }
}

.users-table {
  @media (min-width: 1069px) {
    margin-top: 20px;
  }
}
</style>
