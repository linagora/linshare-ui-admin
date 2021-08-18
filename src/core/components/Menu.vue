<template>
  <a-menu v-model:selectedKeys="current" mode="horizontal" class="navigation-menu">
    <a-menu-item key="configuration" @click="navigateTo('ConfigurationMain')">
      {{ $t("NAVIGATOR.CONFIGURATION" )}}
    </a-menu-item>
    <a-menu-item key="administration" @click="navigateTo('Administration')">
      {{ $t("NAVIGATOR.ADMINISTRATION" )}}
    </a-menu-item>
    <a-menu-item key="reporting" disabled>
      {{ $t("NAVIGATOR.REPORTING" )}}
    </a-menu-item>
    <a-menu-item key="activities" disabled>
      {{ $t("NAVIGATOR.ACTIVITIES" )}}
    </a-menu-item>
    <a-menu-item key="upgrades" disabled>
      {{ $t("NAVIGATOR.UPGRADES" )}}
    </a-menu-item>
  </a-menu>
</template>

<script lang='ts'>
import { defineComponent, computed } from 'vue';
import router from '@/core/router';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'Menu',
  setup () {
    const { meta, name } = useRoute();
    const current = computed(() => [meta.parent || name]);

    function navigateTo (name: string) {
      if (name) {
        router.push({ name });
      }
    }

    return {
      current,
      navigateTo
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
