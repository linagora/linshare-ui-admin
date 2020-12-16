<template>
  <a-layout class="ls-admin-layout" theme='light'>
    <a-layout-sider
      class="ls-app-sider"
      width="256"
      breakpoint="md"
      collapsed-width="0">
      <Sidebar />
    </a-layout-sider>
    <a-layout>
      <a-layout-content class="app-content">
        <Profile/>
        <LanguageSelector />
        <slot v-if="havePermission(role, permission)"/>
        <Error v-else :statusCode="403" :message="$t('ERRORS.FORBIDDEN')"/>
      </a-layout-content>
      <a-layout-footer>
        <Footer />
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script lang='ts'>
import LanguageSelector from '@/core/components/LanguageSelector.vue';
import Profile from '@/core/components/Profile.vue';
import Footer from '@/core/components/Footer.vue';
import Sidebar from '@/core/components/Sidebar.vue';
import Error from '@/modules/error/pages/Error.vue';
import { defineComponent } from 'vue';
import { havePermission } from '@/core/helper';
import store from '@/core/store';

export default defineComponent({
  name: 'AdminLayout',
  components: {
    LanguageSelector,
    Profile,
    Footer,
    Sidebar,
    Error
  },
  props: {
    permission: {
      type: String,
      default: null
    }
  },
  setup () {
    const role = store.getters['Auth/getLoggedUserRole'];

    return {
      role,
      havePermission
    };
  }
});

</script>

<style lang='less'>
.ls-admin-layout {
  .ant-layout-footer {
    background: #fff;
  }
  .app-content {
    padding: 20px;
    background: #fff;
  }
  .ls-app-sider {
    background: #0372B3;
    .ant-layout-sider-zero-width-trigger {
      background: #0372B3;
    }
  }
}
</style>
