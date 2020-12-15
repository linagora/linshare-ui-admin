<template>
  <div>
    <a-dropdown trigger="['click']">
      <a-avatar shape="circle" size="50" class="profile-avatar">
        <span>{{ firstName[0] }}</span>
      </a-avatar>
      <template #overlay>
        <a-menu>
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
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { message } from 'ant-design-vue';

export default {
  setup () {
    const store = useStore();
    const { t } = useI18n();
    const firstName = store.getters['Auth/getLoggedUserFirstName'];

    async function logOut () {
      try {
        await store.dispatch('Auth/logoutUser');
      } catch (e) {
        message.error(t('HEADER.PROFILE.LOGOUT'));
      }

      router.push('/login');
    }

    return {
      logOut,
      firstName
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
</style>
