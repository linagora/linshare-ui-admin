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
        <slot />
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
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AdminLayout',
  components: {
    LanguageSelector,
    Profile,
    Footer,
    Sidebar
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
