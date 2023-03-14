<template>
  <DomainManagementWarning v-if="!isCurrentPageAccessible" />
  <DomainProvidersManagement v-else />
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useDomainStore } from '@/modules/domain/store';
import { DOMAIN_TYPE } from '@/modules/domain/types/Domain';
import useConfigurationPages from '@/core/hooks/useConfigurationPages';
import DomainManagementWarning from '../components/domain-management-warning.vue';
import DomainProvidersManagement from '../components/domain-provider-management.vue';

const { currentRoute, push } = useRouter();
const domainStore = useDomainStore();
const { isCurrentPageAccessible } = useConfigurationPages();

// computed
const isSelectingRootDomain = computed(() => {
  return domainStore.currentDomain?.type === DOMAIN_TYPE.ROOT;
});

watch(
  () => currentRoute.value.fullPath,
  () => {
    if (isSelectingRootDomain.value) {
      push({
        name: 'ConfigurationDomainDetail',
        params: { ...currentRoute.value.params },
        query: { ...currentRoute.value.query },
      });
    }
  }
);
</script>
