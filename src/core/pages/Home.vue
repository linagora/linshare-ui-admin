<template>
  <a-layout class="ls-admin-layout full-height">
    <a-layout-header class="ls-app-header">
      <Header />
    </a-layout-header>
    <a-layout-content class="app-content">
      <Suspense>
        <router-view />
      </Suspense>
    </a-layout-content>
    <a-layout-footer>
      <Footer />
    </a-layout-footer>
  </a-layout>
</template>

<script lang="ts" setup>
import Footer from '@/core/components/Footer.vue';
import Header from '@/core/components/Header.vue';
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
