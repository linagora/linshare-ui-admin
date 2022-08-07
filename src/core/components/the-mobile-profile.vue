<script lang="ts" setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import useProfile from '@/core/hooks/useProfile';
import ChevronRightIcon from '@/core/components/icons/chevron-right-icon.vue';
import CloseIcon from '@/core/components/icons/close-icon.vue';
import UserProfileIcon from '@/core/components/icons/user-profile-icon.vue';
import GlobeIcon from '@/core/components/icons/globe-icon.vue';
import LockIcon from '@/core/components/icons/lock-icon.vue';
import DoorIcon from '@/core/components/icons/door-icon.vue';
import useLanguageModal from '@/core/hooks/useLanguageModal';
import { signOut as logoutOIDC } from '@/modules/auth/services/oidc';
import { logout } from '@/modules/auth/services/basic';
import { useAuthStore } from '@/modules/auth/store';
import { isEnable } from '@/core/utils/functionality';

const authStore = useAuthStore();
const { visible, current, showDrawer, onClose } = useProfile();
const { loggedUser, loggedUserFullName, functionalities } = storeToRefs(authStore);
const { toogleLanguage } = useLanguageModal();
const { push } = useRouter();

const firstFullNameCharacter = computed(() => {
  return loggedUserFullName.value.charAt(0);
});
const secondFAEnabled = computed(() => isEnable(functionalities.value.SECOND_FACTOR_AUTHENTICATION));

function onToggleLanguage() {
  toogleLanguage(true);
  onClose();
}

async function logOut() {
  if (loggedUser.value?.authWithOIDC) {
    await logoutOIDC();
  } else {
    await logout();
  }

  push({ name: 'Login' });
}
</script>

<template>
  <div class="the-mobile-profile">
    <user-profile-icon class="button" @click="showDrawer"></user-profile-icon>
    <a-drawer
      placement="right"
      :closable="false"
      :visible="visible"
      width="100vw"
      class="the-mobile-profile__drawer"
      @close="onClose"
    >
      <div class="the-mobile-profile__header">
        <close-icon class="close" @click="onClose"></close-icon>
        <strong class="title">{{ $t('PROFILE.SETTING') }}</strong>
        <span class="avatar">{{ firstFullNameCharacter }}</span>
      </div>
      <div class="the-mobile-profile__body">
        <div class="the-mobile-profile__info">
          <div class="name">
            {{ loggedUserFullName }}
          </div>
          <div class="mail">
            {{ loggedUser?.mail }}
          </div>
        </div>
        <a-menu v-model:selectedKeys="current" class="navigation-menu">
          <a-menu-item key="language" class="navigation-menu__item" @click="onToggleLanguage()">
            <a name="language" class="link">
              <globe-icon class="icon"></globe-icon>
              <span class="name">{{ $t('HEADER.PROFILE.LANGUAGE') }}</span>
              <chevron-right-icon class="direction"></chevron-right-icon>
            </a>
          </a-menu-item>
          <a-menu-item
            v-if="secondFAEnabled"
            key="second_factor_authentication"
            class="navigation-menu__item"
            @click="onClose()"
          >
            <router-link :to="{ name: 'ManageSecondFactorAuthentication' }" class="link">
              <lock-icon class="icon"></lock-icon>
              <span class="name">{{ $t('HEADER.PROFILE.2FA') }}</span>
              <chevron-right-icon class="direction"></chevron-right-icon>
            </router-link>
          </a-menu-item>
          <a-menu-item key="logout" class="navigation-menu__item" @click="logOut()">
            <a name="logout" class="link">
              <door-icon class="icon"></door-icon>
              <span class="name">{{ $t('HEADER.PROFILE.LOGOUT') }}</span>
              <chevron-right-icon class="direction"></chevron-right-icon>
            </a>
          </a-menu-item>
        </a-menu>
      </div>
    </a-drawer>
  </div>
</template>

<style lang="less" scoped>
.the-mobile-profile {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  &__info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 16px 32px;
    gap: 4px;
    margin-top: 12px;

    .name {
      font-style: normal;
      font-weight: 600;
      font-size: 18px;
      line-height: 24px;
      display: flex;
      align-items: center;
      letter-spacing: 0.01em;
      color: #434657;
    }

    .mail {
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      display: flex;
      align-items: center;
      letter-spacing: -0.01em;
      color: #6d7885;
    }
  }

  .button {
    background-color: @primary-color;
    border: none;
    height: 24px;
    width: 24px;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 16px;
  }

  &__header {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding: 24px;
    box-shadow: inset 0px -1px 0px #e4e5f0;

    .close {
      margin-right: 12px;
    }

    .title {
      font-style: normal;
      font-weight: 600;
      font-size: 17px;
      line-height: 24px;
      display: flex;
      align-items: center;
      color: #434657;
      flex-grow: 1;
    }

    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 100px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      font-style: normal;
      font-weight: 600;
      font-size: 17px;
      color: #007aff;
      background-color: #e6f6ff;
    }
  }
}
</style>
<style lang="less">
.the-mobile-profile__drawer {
  .ant-drawer-body {
    padding: 0;
  }

  .ant-menu-inline,
  .ant-menu-vertical,
  .ant-menu-vertical-left {
    border-right: none;
  }

  .navigation-menu .ant-menu-item {
    height: 60px !important;
    padding: 16px 16px 16px 32px !important;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin: 0 !important;

    .link {
      flex-grow: 1;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
    }

    .direction {
      color: #a7abc3;
    }

    .icon {
      color: @primary-color;
    }
  }

  .navigation-menu .ant-menu-item.ant-menu-item-active {
    color: @primary-color !important;
  }

  .ant-menu-item.ant-menu-item-selected {
    .direction {
      color: @primary-color;
    }
  }

  .ant-menu-title-content {
    font-weight: 500;
    font-size: 17px;
    line-height: 24px;
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
  }

  .ant-menu-title-content .icon {
    margin-right: 20px;
  }

  .ant-menu-title-content .name {
    flex-grow: 1;
  }
}
</style>
