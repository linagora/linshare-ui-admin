<template>
  <div class="large-table">
    <a-list
      item-layout="horizontal"
      :data-source="list"
    >
      <template #renderItem="{ item }">
        <DesktopListItem :data="item" />
      </template>
    </a-list>
    <Pagination class="large-table__pagination" v-model="pagination" :isVisible="list.length" @change="handleTableChange"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useUsersList from '@/modules/user/hooks/useUsersList';
import Pagination from '@/core/components/Pagination.vue';
import DesktopListItem from '@/modules/user/components/DesktopListItem.vue';

export default defineComponent({
  name: 'LargeTable',
  components: {
    Pagination,
    DesktopListItem
  },
  async setup () {
    const { loading, list, pagination, handleTableChange } = useUsersList();

    await handleTableChange(pagination);

    return {
      loading,
      list,
      pagination,
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

    &__pagination {
      margin-top: 30px;
    }

    .ant-table-row {
      cursor: pointer;
    }
  }
</style>
