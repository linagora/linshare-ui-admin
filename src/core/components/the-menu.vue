<script lang="ts" setup>
import config from '@/config';
import useMenu from '@/core/hooks/useMenu';
import useLegacyFeatures from '@/core/hooks/useLegacyFeatures';
import { storeToRefs } from 'pinia';
import { useDomainStore } from '@/modules/domain/store';
import { DOMAIN_TYPE } from '@/modules/domain/types/Domain';
import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';

const { redirect } = useLegacyFeatures();
const router = useRouter();
const route = useRoute();
const { current } = useMenu();
const domainStore = useDomainStore();

const currentDomainUuid = computed(() => domainStore.currentDomain.uuid);
const topMostDomain = computed(() => domainStore.topMostDomain);

function goToDefaultDomain() {
  if (topMostDomain.value) {
    domainStore.setCurrentDomain(topMostDomain.value);
    domainStore.fetchDomain();
    if (route.params.domainUuid) {
      router.push({ name: route.name || undefined, params: { domainUuid: topMostDomain.value?.uuid } });
      return;
    }
    router.push({ name: 'ConfigurationDomainDetail', params: { domainUuid: currentDomainUuid.value } });
    return;
  } else {
    router.push({ name: 'ConfigurationEntries' });
  }
}
</script>

<template>
  <a-menu v-model:selectedKeys="current" mode="horizontal" class="navigation-menu">
    <a-menu-item key="configuration" @click="goToDefaultDomain()">
      <a name="configuration">
        {{ $t('NAVIGATOR.CONFIGURATION') }}
      </a>
    </a-menu-item>
    <a-menu-item key="administration">
      <router-link :to="{ name: 'Administration' }">
        {{ $t('NAVIGATOR.ADMINISTRATION') }}
      </router-link>
    </a-menu-item>
    <a-menu-item key="reporting">
      <router-link :to="{ name: 'Reporting' }">
        {{ $t('NAVIGATOR.REPORTING') }}
      </router-link>
    </a-menu-item>
    <a-menu-item key="activities" @click="redirect('NAVIGATOR.ACTIVITIES')">
      <a name="activities">
        {{ $t('NAVIGATOR.ACTIVITIES') }}
      </a>
    </a-menu-item>
    <a-menu-item key="upgrades" @click="redirect('NAVIGATOR.UPGRADES')">
      <a name="upgrades">
        {{ $t('NAVIGATOR.UPGRADES') }}
      </a>
    </a-menu-item>
    <a-menu-item key="beta">
      <a name="beta" :href="config.legacyAppUrl">
        {{ $t('BETA.MENU') }}
      </a>
    </a-menu-item>
  </a-menu>
</template>

<style lang="less">
.ant-menu.ant-menu-horizontal.navigation-menu {
  border-bottom: 2px solid @primary-color;
  background: @primary-color;
  color: @text-color-inverse;
  font-style: normal;
  font-weight: 600;
  font-size: 17px;

  .ant-menu-item-disabled {
    color: fade(@text-color-inverse, 25%) !important;
  }

  .ant-menu-item-selected {
    color: @text-color-inverse;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.25) 100%);

    &::after {
      border-bottom: 2px solid @text-color-inverse;
    }
  }

  .ant-menu-item {
    margin-right: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: @text-color-inverse;

    &:hover::after {
      border-bottom: 2px solid @text-color-inverse;
    }

    &::after {
      right: 0;
      left: 0;
    }
  }

  .ant-menu-overflow-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .ant-menu-title-content a {
    color: @text-color-inverse;
  }
}

.ant-menu-item.ant-menu-item-only-child {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
