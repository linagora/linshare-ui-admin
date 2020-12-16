<template>
  <div class="large-table">
    <a-table
      :columns="columns"
      :row-key="record => record.uuid"
      :data-source="data"
      :pagination="{pageSize: pageSize}"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import User from '@/modules/user/type/User';

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
    function sortFunction (a: string, b: string) {
      return a && b ? a.localeCompare(b) : (a || b);
    }

    const columns = [
      {
        title: 'First Name',
        dataIndex: 'firstName',
        sorter: (a: User, b: User) => sortFunction(a.firstName, b.firstName),
        width: '20%'
      },
      {
        title: 'Last Name',
        dataIndex: 'lastName',
        sorter: (a: User, b: User) => sortFunction(a.lastName, b.lastName),
        width: '20%'
      },
      {
        title: 'Email',
        dataIndex: 'mail',
        sorter: (a: User, b: User) => sortFunction(a.mail, b.mail),
        width: '25%'
      },
      {
        title: 'Domain',
        dataIndex: 'domain',
        sorter: (a: User, b: User) => sortFunction(a.domain, b.domain),
        width: '20%'
      },
      {
        title: 'Role',
        dataIndex: 'role',
        sorter: (a: User, b: User) => sortFunction(a.role, b.role),
        width: '15%'
      }
    ];

    return {
      columns
    };
  }
});
</script>

<style lang='less' scoped>
  .large-table {
    @media (max-width: 1068px) {
      display: none;
    };
  }
</style>
