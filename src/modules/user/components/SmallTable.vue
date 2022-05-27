<template>
  <ListItem v-for="item in list" :key="item.uuid" :data="item" />
</template>

<script setup lang="ts">
import ListItem from './ListItem.vue';
import useUsersList from '@/modules/user/hooks/useUsersList';

const { list, handleTableChange } = useUsersList();

await handleTableChange();
</script>
