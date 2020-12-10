<template>
  <component :is="currentRoute.meta.layout || 'div'">
    <router-view />
  </component>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'App',
  setup () {
    const { currentRoute } = useRouter();

    return {
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
