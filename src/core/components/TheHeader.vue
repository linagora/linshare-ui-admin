<template>
  <div class="header">
    <div class="header__upper">
      <div class="logo">
        <router-link to="/">
          <img src="@/assets/images/linshare-logo-white.svg" :alt="$t('HEADER.LOGO_ALT')" />
        </router-link>
      </div>
      <div class="header__right">
        <LanguageSelector />
        <TheProfile />
      </div>
    </div>
    <div class="header__menu">
      <TheMenu />
    </div>
  </div>
</template>

<script lang="ts" setup>
import LanguageSelector from '@/core/components/LanguageSelector.vue';
import TheProfile from '@/core/components/TheProfile.vue';
import TheMenu from '@/core/components/TheMenu.vue';
</script>

<style lang="less" scoped>
.header {
  .logo {
    width: 160px;

    img {
      width: 100%;
    }
  }

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
