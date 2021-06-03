<template>
  <component :is="currentRoute.meta.layout || 'div'" :permission="currentRoute.meta.permission">
    <a-config-provider :locale="antdLocale">
      <Suspense>
        <router-view />
      </Suspense>
    </a-config-provider>
  </component>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import useAntConfig from '@/core/hooks/useAntConfig';

export default defineComponent({
  name: 'App',
  setup () {
    const { currentRoute } = useRouter();
    const { antdLocale } = useAntConfig();

    return {
      antdLocale,
      currentRoute
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
