<template>
  <a-config-provider :locale="antdLocale">
    <div v-if="authenticating || hydrating" class="hydrating">
      <a-spin />
    </div>
    <hydrate-error></hydrate-error>
    <router-view v-if="!hydrating" />
  </a-config-provider>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/core/store';
import { storeToRefs } from 'pinia';
import useAntConfig from '@/core/hooks/useAntConfig';
import HydrateError from '@/core/components/HydrateError.vue';
const appStore = useAppStore();
const { hydrating, authenticating } = storeToRefs(appStore);
const { antdLocale } = useAntConfig();
</script>

<style lang="less">
@import '@/core/styles/main.less';

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.hydrating {
  position: fixed;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: @text-color-inverse;
  backdrop-filter: blur(10px);
}
</style>
