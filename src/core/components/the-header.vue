<script lang="ts" setup>
import TheMenu from '@/core/components/the-menu.vue';
import TheProfile from '@/core/components/the-profile.vue';
import TheMobileProfile from '@/core/components/the-mobile-profile.vue';
import TheMobileMenu from '@/core/components/the-mobile-menu.vue';
import LsLanguageModal from '@/core/components/ls-language-modal.vue';
import GlobeIcon from '@/core/components/icons/globe-icon.vue';
import useLanguageModal from '@/core/hooks/useLanguageModal';

const { toogleLanguage } = useLanguageModal();
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
        <the-menu></the-menu>
      </div>
    </div>
    <div class="the-header__right">
      <div class="desktop">
        <globe-icon class="language" @click="toogleLanguage(true)"></globe-icon>
        <the-profile></the-profile>
      </div>
      <div class="mobile">
        <the-mobile-profile></the-mobile-profile>
      </div>
      <ls-language-modal></ls-language-modal>
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
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    .mobile {
      display: flex;
    }
    .desktop {
      display: none;
    }
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
  .the-header__right {
    .mobile {
      display: none;
    }
    .desktop {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
    }
    .language {
      margin-right: 20px;
      color: #fff;
    }
  }
}
</style>
