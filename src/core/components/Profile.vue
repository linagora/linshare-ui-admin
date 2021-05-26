<template>
  <div>
    <a-dropdown :trigger="['click']">
      <a-avatar shape="circle" size="50" class="profile-avatar">
        <span>{{ firstName[0] }}</span>
      </a-avatar>
      <template #overlay>
        <a-menu class="profile-menu">
          <a-menu-item class="profile-info-ctn">
            <div class="profile-name">{{ fullName }}</div>
            <div class="profile-mail">{{ email }}</div>
          </a-menu-item>
          <a-menu-item>
            <router-link to="/second_factor_authentication">
              {{ $t('HEADER.PROFILE.2FA') }}
            </router-link>
          </a-menu-item>
          <a-menu-item @click="logOut()">
            {{ $t('HEADER.PROFILE.LOGOUT') }}
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script lang="ts">
import router from '@/core/router';
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { message } from 'ant-design-vue';

export default {
  setup () {
    const store = useStore();
    const { t } = useI18n();

    async function logOut () {
      try {
        await store.dispatch('Auth/logoutUser');
      } catch (e) {
        message.error(t('HEADER.PROFILE.LOGOUT'));
      }

      router.push({ name: 'login' });
    }

    return {
      logOut,
      firstName: computed(() => store.getters['Auth/getLoggedUserFirstName']),
      fullName: computed(() => store.getters['Auth/getLoggedUserFullName']),
      email: computed(() => store.getters['Auth/getLoggedUserEmail'])
    };
  }
};
</script>

<style lang="less" scoped>
  .profile-avatar {
    float: right;
    cursor: pointer;
    color: #0372b3;
    background-color: #A7D2F8;
  }

  .ant-dropdown-menu-item {
    &:hover {
      color: #0372b3;
    }
  }

  .profile-menu {
    .profile-info-ctn {
      border-bottom: 1px solid #eee;
      cursor: auto;
      &:hover,
      &:focus {
        color: inherit;
        background-color: #fff;
      }

      .profile-name {
        font-weight: 600;
      }

      .profile-mail {
        color: #888;
      }
    }
  }
</style>
