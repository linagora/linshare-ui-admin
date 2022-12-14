<template>
  <DomainManagementWarning v-if="!isCurrentPageAccessible" />

  <DomainProvidersManagement v-else />
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import useConfigurationPages from '@/core/hooks/useConfigurationPages';
import DomainManagementWarning from '../components/domain-management-warning.vue';
import DomainProvidersManagement from '../components/domain-provider-management.vue';

const { currentRoute } = useRouter();
const { isCurrentPageAccessible } = useConfigurationPages();
</script>
