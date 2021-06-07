<template>
  <a-menu v-model:selectedKeys="current" mode="horizontal" class="app-menu app-menu-dark-blue">
    <a-menu-item key="configuration" @click="navigateTo('configuration')">
      {{ $t("NAVIGATOR.CONFIGURATION" )}}
    </a-menu-item>
    <a-menu-item key="administration" @click="navigateTo('administration')">
      {{ $t("NAVIGATOR.ADMINISTRATION" )}}
    </a-menu-item>
    <a-menu-item key="reporting">
      {{ $t("NAVIGATOR.REPORTING" )}}
    </a-menu-item>
    <a-menu-item key="activities">
      {{ $t("NAVIGATOR.ACTIVITIES" )}}
    </a-menu-item>
    <a-menu-item key="upgrades">
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

    function navigateTo (key: string) {
      if (key) {
        router.push({ name: key });
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
  @import '@/assets/styles/variables';
  .app-menu.app-menu-dark-blue {
    background: @dark-blue;
    border-bottom: 2px solid @dark-blue;

    .ant-menu-item {
      color: @light-white;
      font-size: 17px;
      transition: all 0.3s ease-in-out;
    }

    .ant-menu-item:hover,
    .ant-menu-item:focus,
    .ant-menu-item:active,
    .ant-menu-item.ant-menu-item-selected {
      color: @white;
      border-bottom: 2px solid @white;
    }
  }
</style>
