<template>
  <div class="large-table">
    <a-table
      :columns="columns"
      :row-key="record => record.uuid"
      :data-source="data"
      :pagination="{pageSize: pageSize}"
      :locale="{emptyText: $t('USERS.MANAGE_USERS.NO_DATA')}"
      :custom-row="customRow"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import router from '@/core/router';
import User from '@/modules/user/type/User';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'LargeTable',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    pageSize: {
      type: Number,
      default: 5
    }
  },
  async setup () {
    const { t } = useI18n();
    function sortFunction (a: string, b: string) {
      return a && b ? a.localeCompare(b) : (a || b);
    }

    const goToUserDetail = (id: string) => {
      return router.push({ name: 'UserDetail', params: { id } });
    };

    const customRow = (record: User) => {
      return {
        onClick: () => goToUserDetail(record.uuid)
      };
    };

    const columns = [
      {
        title: t('USERS.MANAGE_USERS.FIRST_NAME'),
        dataIndex: 'firstName',
        sorter: (a: User, b: User) => sortFunction(a.firstName, b.firstName),
        width: '15%'
      },
      {
        title: t('USERS.MANAGE_USERS.LAST_NAME'),
        dataIndex: 'lastName',
        sorter: (a: User, b: User) => sortFunction(a.lastName, b.lastName),
        width: '15%'
      },
      {
        title: t('USERS.MANAGE_USERS.EMAIL'),
        dataIndex: 'mail',
        sorter: (a: User, b: User) => sortFunction(a.mail, b.mail),
        width: '20%'
      },
      {
        title: t('USERS.MANAGE_USERS.DOMAIN'),
        dataIndex: 'domain',
        sorter: (a: User, b: User) => sortFunction(a.domain, b.domain),
        width: '20%'
      },
      {
        title: t('USERS.MANAGE_USERS.ROLE'),
        dataIndex: 'role',
        sorter: (a: User, b: User) => sortFunction(a.role, b.role),
        width: '15%'
      },
      {
        title: t('USERS.MANAGE_USERS.ACCOUNT_TYPE'),
        dataIndex: 'accountType',
        sorter: (a: User, b: User) => sortFunction(a.accountType, b.accountType),
        width: '15%'
      }
    ];

    return {
      columns,
      customRow
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
