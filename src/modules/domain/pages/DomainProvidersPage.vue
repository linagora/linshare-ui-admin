<template>
  <PageTitle
    :title="$t(currentRoute.meta.label as string)"
    :breadcrumbs="breadcrumbs"
  />
  <DomainManagementWarning v-if="!isCurrentPageAccessible" />

  <router-view v-else />
</template>

<script lang='ts' setup>
import { useRouter } from 'vue-router';
import PageTitle from '@/core/components/PageTitle.vue';
import useBreadcrumbs from '@/core/hooks/useBreadcrumbs';
import useConfigurationPages from '@/core/hooks/useConfigurationPages';
import DomainManagementWarning from '../components/DomainManagementWarning.vue';

const { currentRoute } = useRouter();
const { breadcrumbs } = useBreadcrumbs();
const { isCurrentPageAccessible } = useConfigurationPages();
</script>
