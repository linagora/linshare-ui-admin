<template>
  <div class="small-table">
    <ListItem v-for="item in list" :data="item" :key="item.uuid"/>
    <a-pagination
      v-show="list.length"
      :total="pagination.total"
      :current="pagination.current"
      :pageSize="pagination.pageSize"
      @change="handlePaginationChange"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ListItem from './ListItem.vue';
import useUsersList from '@/modules/user/hooks/useUsersList';

export default defineComponent({
  name: 'SmallTable',
  components: {
    ListItem
  },
  async setup () {
    const { list, pagination, handlePaginationChange } = useUsersList();

    await handlePaginationChange(pagination.current, pagination.pageSize);

    return {
      list,
      pagination,
      handlePaginationChange
    };
  }
});
</script>

<style lang='less' scoped>
  .small-table {
    display: none;
    @media (max-width: 1067px) {
      display: block;
    }
  }
</style>
