<template>
  <a-layout class="ls-admin-layout full-height" theme='light'>
    <a-layout-header class="ls-app-header">
      <Header />
    </a-layout-header>
    <a-layout-content class="app-content">
      <router-view />
    </a-layout-content>
    <a-layout-footer>
      <Footer />
    </a-layout-footer>
  </a-layout>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import Footer from '@/core/components/Footer.vue';
import Header from '@/core/components/Header.vue';
import use2FARequiredCheck from '@/modules/auth/hooks/use2FARequiredCheck';

export default defineComponent({
  name: 'Home',
  components: {
    Header,
    Footer
  },
  setup () {
    use2FARequiredCheck();
  }
});
</script>

<style lang='less'>
@import '@/assets/styles/variables';
.ls-admin-layout {
  &.full-height {
    position: relative;
    padding-bottom: 103px;
    min-height: 100vh;
  }

  .ant-layout-footer {
    background: @white;
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
  }
  .app-content {
    padding: 20px 40px;
    background: @white;
  }
  .ls-app-header {
    background: @dark-blue;
    height: auto;
  }
}
</style>
