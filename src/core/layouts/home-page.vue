<template>
  <a-layout class="ls-admin-layout full-height">
    <a-layout-header class="ls-app-header">
      <the-header />
    </a-layout-header>
    <a-layout-content class="ls-app-content" :class="{ beta: $route.meta.uiBeta }">
      <Suspense>
        <router-view />
      </Suspense>
    </a-layout-content>
    <a-layout-footer>
      <TheFooter />
    </a-layout-footer>
  </a-layout>
</template>

<script lang="ts" setup>
import TheFooter from '@/core/components/the-footer.vue';
import TheHeader from '@/core/components/the-header.vue';
import use2FARequiredCheck from '@/modules/auth/hooks/use2FARequiredCheck';

use2FARequiredCheck();
</script>

<style lang="less" scoped>
.ls-admin-layout {
  &.full-height {
    position: relative;
    min-height: 100vh;
  }

  .ls-app-content {
    padding: 20px 40px;

    &.beta {
      background-color: #f3f3f7;
      padding: 0;
    }
  }
  .ls-app-header {
    height: auto;
    padding: 0;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    z-index: 100;
    background: #007aff;
  }
  .ls-app-content {
    margin-top: 65px;
  }
}
</style>
