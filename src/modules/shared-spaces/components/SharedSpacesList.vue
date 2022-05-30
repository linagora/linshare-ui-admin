<template>
  <div class="shared-spaces-list">
    <a-list item-layout="horizontal" :loading="loading" :data-source="list">
      <template #renderItem="{ item }">
        <SharedSpaceItem :data="item" />
      </template>
    </a-list>
  </div>
</template>

<script setup lang="ts">
import useSharedSpacesList from '@/modules/shared-spaces/hooks/useSharedSpacesList';
import SharedSpaceItem from './SharedSpaceItem.vue';

const { loading, list, handleTableChange } = useSharedSpacesList();
await handleTableChange();
</script>

<style lang="less">
.shared-spaces-list {
  .ant-table-row {
    cursor: pointer;
  }
}
</style>
