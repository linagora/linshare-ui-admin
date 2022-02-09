<template>
  <a-menu
    v-model:selectedKeys="current"
    mode="horizontal"
    class="navigation-menu"
  >
    <a-menu-item
      key="configuration"
      @click="navigateTo('Configuration')"
    >
      {{ $t("NAVIGATOR.CONFIGURATION" ) }}
    </a-menu-item>
    <a-menu-item
      key="administration"
      @click="navigateTo('Administration')"
    >
      {{ $t("NAVIGATOR.ADMINISTRATION" ) }}
    </a-menu-item>
    <a-menu-item
      key="activities"
      @click="navigateTo('NAVIGATOR.ACTIVITIES', true)"
    >
      {{ $t("NAVIGATOR.ACTIVITIES" ) }}
    </a-menu-item>
    <a-menu-item
      key="upgrades"
      @click="navigateTo('NAVIGATOR.UPGRADES', true)"
    >
      {{ $t("NAVIGATOR.UPGRADES" ) }}
    </a-menu-item>
    <a-menu-item
      key="reporting"
      disabled
    >
      {{ $t("NAVIGATOR.REPORTING" ) }}
    </a-menu-item>
    <a-menu-item
      v-if="isBeta"
      :title="$t('BETA.MENU_TITLE')"
    >
      <a :href="legacyAppUrl">{{ $t('BETA.MENU' ) }}</a>
    </a-menu-item>
  </a-menu>
</template>

<script lang='ts' setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import useLegacyFeatures from '../hooks/useLegacyFeatures';
import config from '@/config';

const { currentRoute, push } = useRouter();

const { redirect } = useLegacyFeatures();
const current = ref([currentRoute.value.path.split('/')[1]]);
const isBeta = config.beta;
const legacyAppUrl = config.legacyAppUrl;

function navigateTo (name: string, legacy?: boolean) {
  if (legacy) {
    redirect(name);

    return;
  }

  push({ name });
}
watch(currentRoute, newRoute => {
  current.value = [newRoute.path.split('/')[1]];
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
