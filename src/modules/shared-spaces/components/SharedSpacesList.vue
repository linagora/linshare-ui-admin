<template>
  <div class="shared-spaces-list">
    <a-list
      item-layout="horizontal"
      :loading="loading"
      :data-source="list"
    >
      <template #renderItem="{ item }">
        <SharedSpaceItem :data="item" />
      </template>
    </a-list>
    <Pagination
      class="shared-spaces-list__pagination"
      v-model="pagination"
      :isVisible="!!list.length"
      @change="handlePaginationChange"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useSharedSpacesList from '@/modules/shared-spaces/hooks/useSharedSpacesList';
import Pagination from '@/core/components/Pagination.vue';
import SharedSpaceItem from './SharedSpaceItem.vue';

export default defineComponent({
  name: 'SharedSpacesList',
  components: {
    Pagination,
    SharedSpaceItem
  },
  async setup () {
    const { loading, list, pagination, handlePaginationChange } = useSharedSpacesList();

    await handlePaginationChange(pagination);

    return {
      loading,
      list,
      pagination,
      handlePaginationChange
    };
  }
});
</script>

<style lang='less'>
  .shared-spaces-list {
    &__pagination {
      margin-top: 30px;
    }

    .ant-table-row {
      cursor: pointer;
    }
  }
</style>
