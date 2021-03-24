<template>
  <div class="large-table">
    <a-table
      :columns="columns"
      :row-key="record => record.uuid"
      :data-source="list"
      :pagination="pagination"
      :locale="{emptyText: $t('USERS.MANAGE_USERS.NO_DATA')}"
      :custom-row="customRow"
      :loading="loading"
      @change="handleTableChange"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import router from '@/core/router';
import User from '@/modules/user/type/User';
import { useI18n } from 'vue-i18n';
import useUsersList from '@/modules/user/hooks/useUsersList';

export default defineComponent({
  name: 'LargeTable',
  async setup () {
    const { t } = useI18n();
    const { loading, list, pagination, handleTableChange } = useUsersList();
    const columns = computed(() => [
      {
        title: t('USERS.MANAGE_USERS.FIRST_NAME'),
        dataIndex: 'firstName',
        sorter: true,
        width: '15%'
      },
      {
        title: t('USERS.MANAGE_USERS.LAST_NAME'),
        dataIndex: 'lastName',
        sorter: true,
        width: '15%'
      },
      {
        title: t('USERS.MANAGE_USERS.EMAIL'),
        dataIndex: 'mail',
        sorter: true,
        width: '20%'
      },
      {
        title: t('USERS.MANAGE_USERS.DOMAIN'),
        dataIndex: 'domain',
        width: '20%'
      },
      {
        title: t('USERS.MANAGE_USERS.ROLE'),
        dataIndex: 'role',
        sorter: true,
        width: '15%'
      },
      {
        title: t('USERS.MANAGE_USERS.ACCOUNT_TYPE'),
        dataIndex: 'accountType',
        sorter: true,
        width: '15%'
      }
    ]);

    await handleTableChange(pagination);

    function customRow (user: User) {
      return {
        onclick () {
          router.push({ name: 'UserDetail', params: { id: user.uuid } });
        }
      };
    }

    return {
      loading,
      list,
      pagination,
      columns,
      customRow,
      handleTableChange
    };
  }
});
</script>

<style lang='less'>
  .large-table {
    @media (max-width: 1068px) {
      display: none;
    };

    .ant-table-row {
      cursor: pointer;
    }
  }
</style>
