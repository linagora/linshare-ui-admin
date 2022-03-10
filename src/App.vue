<template>
  <a-config-provider :locale="antdLocale">
    <div v-if="authenticating || hydrating" class="hydrating">
      <a-spin />
    </div>

    <router-view v-if="!hydrating" />
  </a-config-provider>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import useAntConfig from '@/core/hooks/useAntConfig';

const store = useStore();
const hydrating = computed(() => store.getters.isHydrating);
const authenticating = computed(() => store.getters.isAuthenticating);
const { antdLocale } = useAntConfig();
</script>

<style lang="less">
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
