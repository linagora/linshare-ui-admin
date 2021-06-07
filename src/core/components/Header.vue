
<template>
  <div class="header">
    <div class="header__upper">
      <div class="header__left">
        <router-link :to="{ name: 'configuration' }">
          <img
            src="@/assets/images/linshare-logo-white.png"
            :alt="$t('HEADER.LOGO_ALT')"
          >
        </router-link>
      </div>
      <div class="header__right">
        <LanguageSelector />
        <Profile />
      </div>
    </div>
    <div class="header__menu">
      <Menu />
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import LanguageSelector from '@/core/components/LanguageSelector.vue';
import Profile from '@/core/components/Profile.vue';
import Menu from '@/core/components/Menu.vue';

export default defineComponent({
  name: 'Header',
  components: {
    LanguageSelector,
    Profile,
    Menu
  }
});
</script>

<style lang="less" scoped>
  .header{
    &__upper {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &__right {
      display: flex;
      align-items: center;
    }
  }
</style>
