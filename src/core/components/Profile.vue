<template>
  <div>
    <a-dropdown :trigger="['click']">
      <a-avatar shape="circle" size="50" class="profile-avatar">
        <span>{{ firstName && firstName[0] || 'A' }}</span>
      </a-avatar>
      <template #overlay>
        <a-menu class="profile-menu">
          <a-menu-item class="profile-info-ctn">
            <div class="profile-name">{{ fullName }}</div>
            <div class="profile-mail">{{ email }}</div>
          </a-menu-item>
          <router-link to="/second_factor_authentication">
            <a-menu-item>
              {{ $t('HEADER.PROFILE.2FA') }}
            </a-menu-item>
          </router-link>
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
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { message } from 'ant-design-vue';

export default defineComponent({
  setup () {
    const store = useStore();
    const { t } = useI18n();

    async function logOut () {
      try {
        await store.dispatch('Auth/logoutUser');
      } catch (e) {
        message.error(t('HEADER.PROFILE.LOGOUT'));
      }

      router.push({ name: 'Login' });
    }

    return {
      logOut,
      firstName: computed(() => store.getters['Auth/getLoggedUserFirstName']),
      fullName: computed(() => store.getters['Auth/getLoggedUserFullName']),
      email: computed(() => store.getters['Auth/getLoggedUserEmail'])
    };
  }
});
</script>

<style lang="less" scoped>
  .profile-avatar {
    float: right;
    cursor: pointer;
    color: @primary-color;
    background-color: @primary-1;
  }

  .profile-menu {
    .profile-info-ctn {
      .profile-name {
        font-weight: 600;
      }

      .profile-mail {
        color: @text-color-secondary;
      }
    }
  }
</style>
