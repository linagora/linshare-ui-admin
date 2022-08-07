<script lang="ts" setup>
import TheMenu from '@/core/components/TheMenu.vue';
import TheProfile from '@/core/components/TheProfile.vue';
import TheMobileMenu from '@/core/components/TheMobileMenu.vue';
</script>

<template>
  <div class="the-header">
    <div class="the-header__left">
      <div class="mobile">
        <the-mobile-menu></the-mobile-menu>
      </div>
      <div class="logo">
        <router-link to="/">
          <img src="@/assets/images/linshare-logo-white.svg" :alt="$t('HEADER.LOGO_ALT')" />
        </router-link>
      </div>
      <div class="menu">
        <the-menu mode="horizontal"></the-menu>
      </div>
    </div>
    <div class="the-header__right">
      <the-profile></the-profile>
    </div>
  </div>
</template>
<style lang="less" scoped>
.the-header {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0 40px;

  &__left {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-grow: 1;
    width: calc(100vw - 280px);

    .mobile {
      display: flex;
    }

    .logo {
      width: 160px;
      min-width: 160px;
      padding-right: 40px;
      position: relative;
      box-sizing: content-box;

      img {
        width: 100%;
      }
    }

    .logo::after {
      display: none;
    }

    .menu {
      display: none;
    }
  }
  &__right {
    width: 200px;
  }
}

@media (min-width: 992px) {
  .the-header__left {
    .menu {
      display: inline-block;
      flex-grow: 1;
      margin-left: 40px;
      width: calc(100vw - 480px);
    }

    .logo::after {
      content: '';
      display: inline-block;
      height: calc(100% - 28px);
      width: 0.5px;
      border-radius: 100px;
      background-color: #e4e5f0;
      position: absolute;
      right: 0;
      top: 14px;
      bottom: 14px;
    }

    .mobile {
      display: none;
    }
  }
}
</style>
