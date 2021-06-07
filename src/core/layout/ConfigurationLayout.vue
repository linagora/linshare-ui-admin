<template>
  <a-layout class="ls-configuration-layout full-height" theme='light'>
    <a-layout-header class="ls-app-header">
      <Header />
    </a-layout-header>
    <a-layout-content class="app-content">
      <a-row>
        <a-col :xs="4">
          <Domains />
        </a-col>
        <a-col :xs="20">
          <slot v-if="havePermission(role, permission)"/>
          <Error v-else :statusCode="403" :message="$t('ERRORS.FORBIDDEN')"/>
        </a-col>
      </a-row>
    </a-layout-content>
    <a-layout-footer>
      <Footer />
    </a-layout-footer>
  </a-layout>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import { havePermission } from '@/core/helper';
import store from '@/core/store';
import Footer from '@/core/components/Footer.vue';
import Header from '@/core/components/Header.vue';
import Domains from '@/core/components/Domains.vue';
import Error from '@/modules/error/pages/Error.vue';
import use2FARequiredCheck from '@/modules/auth/hooks/use2FARequiredCheck';

export default defineComponent({
  name: 'ConfigurationLayout',
  components: {
    Header,
    Footer,
    Domains,
    Error
  },
  props: {
    permission: {
      type: String,
      default: null
    }
  },
  setup () {
    use2FARequiredCheck();
    const role = store.getters['Auth/getLoggedUserRole'];

    return {
      role,
      havePermission
    };
  }
});
</script>

<style lang='less'>
@import '@/assets/styles/variables';
.ls-configuration-layout {
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
