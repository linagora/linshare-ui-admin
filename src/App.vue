<template>
  <a-config-provider :locale="antdLocale">
    <router-view />
  </a-config-provider>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import useAntConfig from '@/core/hooks/useAntConfig';

export default defineComponent({
  name: 'App',
  setup () {
    const { antdLocale } = useAntConfig();

    return {
      antdLocale
    };
  }
});

</script>

<style lang='less'>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
