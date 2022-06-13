<template>
  <a-layout class="ls-admin-layout full-height">
    <a-layout-header class="ls-app-header">
      <TheHeader />
    </a-layout-header>
    <a-layout-content class="app-content">
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
import TheFooter from '@/core/components/TheFooter.vue';
import TheHeader from '@/core/components/TheHeader.vue';
import use2FARequiredCheck from '@/modules/auth/hooks/use2FARequiredCheck';

use2FARequiredCheck();
</script>

<style lang="less">
.ls-admin-layout {
  &.full-height {
    position: relative;
    min-height: 100vh;
  }

  .app-content {
    padding: 20px 40px;
  }
  .ls-app-header {
    height: auto;
  }
}
</style>
