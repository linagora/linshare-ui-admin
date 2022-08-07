<script lang="ts" setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/modules/auth/store';
import useLegacyFeatures from '@/core/hooks/useLegacyFeatures';
import useMenu from '@/core/hooks/useMenu';
import config from '@/config';
import ChevronRightIcon from '@/core/components/icons/chevron-right-icon.vue';
import PollsquareIcon from '@/core/components/icons/pollsquare-icon.vue';
import LightBulbIcon from '@/core/components/icons/light-bulb-icon.vue';
import NewsfeedIcon from '@/core/components/icons/newsfeed-icon.vue';
import ServicesIcon from '@/core/components/icons/services-icon.vue';
import SwitchIcon from '@/core/components/icons/switch-icon.vue';
import UsersIcon from '@/core/components/icons/users-icon.vue';
import CloseIcon from '@/core/components/icons/close-icon.vue';
import MenuIcon from '@/core/components/icons/menu-icon.vue';

const authStore = useAuthStore();
const { redirect } = useLegacyFeatures();
const { visible, current, showDrawer, onClose } = useMenu();
const { loggedUserFullName } = storeToRefs(authStore);

const firstFullNameCharacter = computed(() => {
  return loggedUserFullName.value.charAt(0);
});
</script>

<template>
  <div class="the-mobile-menu">
    <menu-icon class="button" @click="showDrawer"></menu-icon>
    <a-drawer
      placement="left"
      :closable="false"
      :visible="visible"
      width="100vw"
      class="the-mobile-menu__drawer"
      @close="onClose"
    >
      <div class="the-mobile-menu__header">
        <close-icon class="close" @click="onClose"></close-icon> <strong class="title">LinShare Admin</strong>
        <span class="avatar">{{ firstFullNameCharacter }}</span>
      </div>
      <div class="the-mobile-menu__body">
        <a-menu v-model:selectedKeys="current" class="navigation-menu">
          <a-menu-item key="configuration" @click="onClose">
            <router-link :to="{ name: 'Configuration' }" class="link">
              <switch-icon class="icon"></switch-icon>
              <span class="name">{{ $t('NAVIGATOR.CONFIGURATION') }}</span>
              <chevron-right-icon class="direction"></chevron-right-icon>
            </router-link>
          </a-menu-item>
          <a-menu-item key="administration" @click="onClose">
            <router-link :to="{ name: 'Administration' }" class="link">
              <users-icon class="icon"></users-icon>
              <span class="name">{{ $t('NAVIGATOR.ADMINISTRATION') }}</span>
              <chevron-right-icon class="direction"></chevron-right-icon>
            </router-link>
          </a-menu-item>
          <a-menu-item key="reporting" @click="onClose">
            <router-link :to="{ name: 'Reporting' }" class="link">
              <pollsquare-icon class="icon"></pollsquare-icon>
              <span class="name">{{ $t('NAVIGATOR.REPORTING') }}</span>
              <chevron-right-icon class="direction"></chevron-right-icon>
            </router-link>
          </a-menu-item>
          <a-menu-item key="activities" @click="redirect('NAVIGATOR.ACTIVITIES')">
            <router-link :to="{ name: 'Reporting' }" class="link">
              <newsfeed-icon class="icon"></newsfeed-icon>
              <span class="name">{{ $t('NAVIGATOR.ACTIVITIES') }}</span>
              <chevron-right-icon class="direction"></chevron-right-icon>
            </router-link>
          </a-menu-item>
          <a-menu-item key="upgrades" @click="redirect('NAVIGATOR.UPGRADES')">
            <a name="upgrades" class="link">
              <light-bulb-icon class="icon"></light-bulb-icon>
              <span class="name">{{ $t('NAVIGATOR.UPGRADES') }}</span>
              <chevron-right-icon class="direction"></chevron-right-icon>
            </a>
          </a-menu-item>
          <a-menu-item key="beta" @click="onClose">
            <a name="beta" :href="config.legacyAppUrl" class="link">
              <services-icon class="icon"></services-icon>
              <span class="name">{{ $t('BETA.MENU') }}</span>
              <chevron-right-icon class="direction"></chevron-right-icon>
            </a>
          </a-menu-item>
        </a-menu>
      </div>
    </a-drawer>
  </div>
</template>

<style lang="less" scoped>
.the-mobile-menu {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  .button {
    background-color: @primary-color;
    color: @text-color-inverse;
    border: none;
    height: 30px;
    width: 30px;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 16px;
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
.the-mobile-menu__drawer {
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
    padding: 16px 16px 16px 32px;
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
