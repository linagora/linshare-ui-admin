<template>Here is domain-user-providers page with domainuuid: {{ currentDomainUuid }}</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const currentDomainUuid = computed(() => {
  return route.params.domainUuid;
});
</script>
