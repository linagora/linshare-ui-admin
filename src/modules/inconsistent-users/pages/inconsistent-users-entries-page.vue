<template>
  <div class="configuration-page">
    <div class="configuration-page__wrapper">
      <div class="inconsistent-users-page">
        <div class="inconsistent-users-page-tabs">
          <inconsistent-users-tabs></inconsistent-users-tabs>
        </div>
        <div class="inconsistent-users-page__content">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { computed, reactive, watch } from 'vue';
import { useDomainStore } from '@/modules/domain/store';
import inconsistentUsersTabs from '../components/inconsistent-users-tabs.vue';
import ArrowLeftIcon from '@/core/components/icons/arrow-left-icon.vue';

const breadcrumbsWithDomain = computed(() => {
  const newBreadcrumbs = [
    {
      label: 'NAVIGATOR.ADMINISTRATION',
      path: 'Administration',
    },
    {
      label: 'INCONSISTENT_USERS.TITLE',
      path: 'administration/InconsistentUsers',
    },
  ];
  return newBreadcrumbs;
});
</script>
<style lang="less" scoped>
.title {
  margin-left: 10px;
}
.inconsistent-users-page {
  display: flex;
  flex-direction: column;
}
</style>
