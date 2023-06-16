<template>
  <div class="configuration-page">
    <div class="configuration-page__wrapper">
      <div class="configuration-page__header">
        <div class="configuration-page__header-title">
          <div class="configuration-page__header-title-content">
            <router-link :to="{ name: 'Administration' }">
              <ArrowLeftIcon></ArrowLeftIcon>
            </router-link>
            <strong class="title">{{ $t('INCONSISTENT_USERS.TITLE') }}</strong>
            <a-breadcrumb class="breakcrumb" :routes="breadcrumbsWithDomain">
              <template #itemRender="{ route, routes }">
                <span v-if="routes.indexOf(route) === routes.length - 1" class="current">
                  {{ $t(route.label) }}
                </span>

                <router-link v-else :to="{ name: route.path, params: route?.params }">
                  {{ $t(route.label) }}
                </router-link>
              </template>
            </a-breadcrumb>
          </div>
        </div>
      </div>
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
</style>
