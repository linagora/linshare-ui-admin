<template>
  <a-menu v-model:selectedKeys="current" mode="horizontal" class="navigation-menu">
    <a-menu-item key="configuration" @click="navigateTo('Configuration')">
      {{ $t("NAVIGATOR.CONFIGURATION" )}}
    </a-menu-item>
    <a-menu-item key="administration" @click="navigateTo('Administration')">
      {{ $t("NAVIGATOR.ADMINISTRATION" )}}
    </a-menu-item>
    <a-menu-item key="activities" @click="navigateTo('NAVIGATOR.ACTIVITIES', true)">
      {{ $t("NAVIGATOR.ACTIVITIES" )}}
    </a-menu-item>
    <a-menu-item key="upgrades" @click="navigateTo('NAVIGATOR.UPGRADES', true)">
      {{ $t("NAVIGATOR.UPGRADES" )}}
    </a-menu-item>
    <a-menu-item key="reporting" disabled>
      {{ $t("NAVIGATOR.REPORTING" )}}
    </a-menu-item>
    <a-menu-item v-if="isBeta" :title="$t('BETA.MENU_TITLE')">
      <a :href="legacyAppUrl">{{ $t('BETA.MENU' )}}</a>
    </a-menu-item>
  </a-menu>
</template>

<script lang='ts'>
import { defineComponent, computed } from 'vue';
import { useRouter } from 'vue-router';
import useLegacyFeatures from '../hooks/useLegacyFeatures';
import ConfigService from '@/core/services/ConfigService';
import { CONFIGURATION_KEY } from '../types/AppConfiguration';

export default defineComponent({
  name: 'Menu',
  setup () {
    const { currentRoute, push } = useRouter();
    const { redirect } = useLegacyFeatures();
    const current = computed(() => [currentRoute.value.meta.parent || currentRoute.value.name]);
    const isBeta = ConfigService.get(CONFIGURATION_KEY.BETA);
    const legacyAppUrl = ConfigService.get(CONFIGURATION_KEY.LEGACY_APP_URL);

    function navigateTo (name: string, legacy?: boolean) {
      if (legacy) {
        redirect(name);

        return;
      }

      push({ name });
    }

    return {
      isBeta,
      current,
      navigateTo,
      legacyAppUrl
    };
  }
});
</script>

<style lang="less">
  .ant-menu.ant-menu-horizontal.navigation-menu {
    border-bottom: 2px solid @primary-color;

    .ant-menu-item-disabled {
      color: fade(@menu-highlight-color, 25%) !important;
    }
  }
</style>
