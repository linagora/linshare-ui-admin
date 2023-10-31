<script lang="ts" setup>
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useDomainStore } from '@/modules/domain/store';
import useBreadcrumbs from '@/core/hooks/useBreadcrumbs';
import TheSubheader from '@/core/components/the-subheader.vue';
import ArrowLeftIcon from '@/core/components/icons/arrow-left-icon.vue';
import { ADMINISTRATIONS_TEMPLATES_ROUTE_NAMES } from '@/modules/administration/router/index';

// composables
const routeInstance = useRoute();
const { breadcrumbs } = useBreadcrumbs();

// computed
const routeTitle = computed(() => {
  return routeInstance.meta.label?.toString();
});
const breadcrumbsWithDomain = computed(() => {
  const newBreadcrumbs = [...breadcrumbs.value];
  if (
    routeInstance.name?.toString() ==
    ADMINISTRATIONS_TEMPLATES_ROUTE_NAMES.CONTACT_LISTS_ROUTE_NAMES.CONTACT_LIST_DETAIL?.toString()
  ) {
    newBreadcrumbs[newBreadcrumbs.length - 1].label = routeInstance.meta.label?.toString() || '';
  }
  return newBreadcrumbs;
});

const prevRoute = computed(() => {
  return breadcrumbsWithDomain.value[breadcrumbsWithDomain.value?.length - 2];
});

const blankPage = computed(() => {
  return routeInstance.meta.blankPage;
});

watch(
  () => routeInstance,
  () => {
    if (
      routeInstance.name?.toString() ==
      ADMINISTRATIONS_TEMPLATES_ROUTE_NAMES.CONTACT_LISTS_ROUTE_NAMES.CONTACT_LIST_DETAIL?.toString()
    ) {
      breadcrumbs.value[breadcrumbs.value.length - 1].label = routeInstance.meta.label?.toString() || '';
    }
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>
<template>
  <the-subheader :title="$t('NAVIGATOR.ADMINISTRATION')" :detail="$t('ADMINISTRATION.INTRODUCTION')"> </the-subheader>
  <div class="administration-page">
    <div v-if="!blankPage" class="administration-page__wrapper">
      <div class="administration-page__header">
        <div class="administration-page__header-title">
          <router-link :to="{ name: prevRoute.path }" class="administration-page__header-back">
            <ArrowLeftIcon></ArrowLeftIcon>
          </router-link>
          <div class="administration-page__header-title-content">
            <strong class="title">{{ $t(routeTitle || '') }}</strong>
            <a-breadcrumb class="breakcrumb" :routes="breadcrumbsWithDomain">
              <template #itemRender="{ route, routes }">
                <span v-if="routes.indexOf(route) === routes.length - 1 || route.disableAction" class="current">
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
      <div class="administration-page__body">
        <router-view></router-view>
      </div>
    </div>
    <router-view v-else></router-view>
  </div>
</template>
<style lang="less">
.administration-page {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  width: 100%;
  background-color: #f6f6f6;
  padding: 0;

  &__back {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 4px;
    padding-right: 17px;
  }

  &__wrapper {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 16px;
    gap: 16px;
    background: #ffffff;
    border-radius: 10px;
    min-height: 68vh;
  }

  &__header {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    flex-wrap: wrap;
    padding-bottom: 16px;
    border-bottom: 1px solid #e4e5f0;
    gap: 12px;
  }

  &__header-title {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    flex-grow: 1;
    gap: 12px;

    .title {
      font-style: normal;
      font-weight: 700;
      font-size: 24px;
      line-height: 28px;
      color: #434657;
    }

    .breakcrumb {
      font-style: normal;
      font-weight: 500;
      font-size: 15px;
      line-height: 20px;
      color: #989cb1;
    }

    .current {
      color: #434657;
    }
  }

  .action {
    padding-left: 12px;
    padding-right: 12px;
    margin-right: 4px;
  }

  &__body {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: 16px;
  }

  &__header-title-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 8px;
  }
  &__header-back {
    padding: 4px;
  }
  &__header-back svg {
    width: 20px;
    height: 20px;
    color: #6d7885;
  }

  .desktop {
    display: none;
  }
}

@media (min-width: 992px) {
  .administration-page {
    padding: 20px;

    &__wrapper {
      padding: 32px;
    }

    .action {
      .icon {
        margin-right: 8px;
      }

      .desktop {
        display: block;
      }
    }
  }
}
</style>
