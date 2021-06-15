<template>
  <div class="manage-users">
    <PageTitle
      :title="$t('USERS.MANAGE_USERS.TITLE')"
      :subtitle="$t('USERS.MANAGE_USERS.SUBTITLE')"
      :breadcrumbs="breadcrumbs"
    >
      <template #helperContent>
        <div class='alert-message-in-description'>{{ $t('NAVIGATOR.USERS') }}</div>
        <div>{{ $t('USERS.MANAGE_USERS.DESCRIPTION') }}</div>
        <div class='alert-message-in-description'>{{ $t('USERS.MANAGE_USERS.OPERATION') }}</div>
        <div>{{ $t('USERS.MANAGE_USERS.SEARCH_GUIDE') }}</div>
        <div>{{ $t('USERS.MANAGE_USERS.NAVIGATE_GUIDE') }}</div>
      </template>
    </PageTitle>

    <div class="users-list">
      <TokenInput
        :filterOptions="filterOptions"
        :sortOptions="sortOptions"
        :placeholder="$t('USERS.TOKEN_INPUT.PLACEHOLDER')"
        @submit="handleSubmit"
      />
      <LargeTable />
      <SmallTable />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import PageTitle from '@/core/components/PageTitle.vue';
import LargeTable from '@/modules/user/components/LargeTable.vue';
import SmallTable from '@/modules/user/components/SmallTable.vue';
import TokenInput, { Filter } from '@/core/components/TokenInput.vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import useUsersList from '@/modules/user/hooks/useUsersList';

interface Options {
  filters: Filter;
  sort: {
    field: string;
    order: string;
  };
}

export default defineComponent({
  name: 'ManageUsers',
  components: {
    TokenInput,
    LargeTable,
    SmallTable,
    PageTitle
  },
  setup () {
    const { meta } = useRoute();
    const { pagination, handleTableChange } = useUsersList();
    const { locale, t } = useI18n();

    const breadcrumbs = meta && meta.parent && meta.parentName
      ? [{
        key: meta.parent,
        label: meta.parentName
      }] : [];

    const handleSubmit = async function (options: Options) {
      await handleTableChange(pagination, options.filters, options.sort);
    };

    const sortOptions = [
      {
        key: 'domain',
        label: 'USERS.DETAIL_USER.DOMAIN'
      },
      {
        key: 'firstName',
        label: 'USERS.DETAIL_USER.FIRST_NAME'
      },
      {
        key: 'lastName',
        label: 'USERS.DETAIL_USER.LAST_NAME'
      },
      {
        key: 'mail',
        label: 'USERS.MANAGE_USERS.EMAIL'
      },
      {
        key: 'creationDate',
        label: 'USERS.DETAIL_USER.CREATION_DATE'
      },
      {
        key: 'modificationDate',
        label: 'USERS.DETAIL_USER.MODIFICATION_DATE',
        default: true
      }
    ];

    const filterOptions = [
      {
        key: 'mail',
        displayKey: 'USERS.MANAGE_USERS.EMAIL',
        isDefaultToken: true
      },
      {
        key: 'firstName',
        displayKey: 'USERS.DETAIL_USER.FIRST_NAME'
      },
      {
        key: 'lastName',
        displayKey: 'USERS.DETAIL_USER.LAST_NAME'
      },
      {
        key: 'role',
        displayKey: 'USERS.DETAIL_USER.ROLE',
        options: [
          {
            value: 'SIMPLE',
            label: computed(() => t('USERS.DETAIL_USER.ROLE_SIMPLE', locale.value))
          },
          {
            value: 'ADMIN',
            label: computed(() => t('USERS.DETAIL_USER.ROLE_ADMIN', locale.value))
          },
          {
            value: 'SUPERADMIN',
            label: computed(() => t('USERS.DETAIL_USER.ROLE_SUPERADMIN', locale.value))
          }
        ]
      },
      {
        key: 'type',
        displayKey: 'USERS.DETAIL_USER.ACCOUNT_TYPE',
        options: [
          {
            value: 'ROOT',
            label: computed(() => t('USERS.DETAIL_USER.TYPE_ROOT', locale.value))
          },
          {
            value: 'INTERNAL',
            label: computed(() => t('USERS.DETAIL_USER.TYPE_INTERNAL', locale.value))
          },
          {
            value: 'GUEST',
            label: computed(() => t('USERS.DETAIL_USER.TYPE_GUEST', locale.value))
          }
        ]
      },
      {
        key: 'canCreateGuest',
        displayKey: 'USERS.DETAIL_USER.GUEST_CREATION_RIGHTS',
        options: [
          {
            value: true,
            label: computed(() => t('USERS.DETAIL_USER.YES', locale.value))
          },
          {
            value: false,
            label: computed(() => t('USERS.DETAIL_USER.NO', locale.value))
          }
        ]
      },
      {
        key: 'canUpload',
        displayKey: 'USERS.DETAIL_USER.UPLOAD_RIGHTS',
        options: [
          {
            value: true,
            label: computed(() => t('USERS.DETAIL_USER.YES', locale.value))
          },
          {
            value: false,
            label: computed(() => t('USERS.DETAIL_USER.NO', locale.value))
          }
        ]
      }
    ];

    return {
      breadcrumbs,
      sortOptions,
      filterOptions,
      handleSubmit
    };
  }
});
</script>

<style lang='less' scoped>
  @import '@/assets/styles/variables';

  .manage-users {
    .users-list {
      margin-top: 40px;
    }

    .alert-message-in-description {
      display: block;
      margin-top: 10px;
      margin-bottom: 4px;
      color: rgba(0, 0, 0, 0.85);
      font-size: 16px;
    }
  }
</style>
