<template>
  <div class="large-table">
    <a-list item-layout="horizontal" :data-source="list" :loading="loading">
      <template #renderItem="{ item }">
        <DesktopListItem :data="item" />
      </template>
    </a-list>
  </div>
</template>

<script setup lang="ts">
import useUsersList from '@/modules/user/hooks/useUsersList';
import DesktopListItem from '@/modules/user/components/DesktopListItem.vue';

const { loading, list, handleTableChange } = useUsersList();

await handleTableChange();
</script>

<style lang="less">
.large-table {
  .ant-table-row {
    cursor: pointer;
  }
}
</style>
