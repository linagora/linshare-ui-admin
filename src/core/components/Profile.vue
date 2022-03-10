<template>
  <div>
    <a-dropdown :trigger="['click']">
      <a-avatar shape="circle" size="50" class="profile-avatar">
        <span>{{ (loggedUser?.firstName && loggedUser.firstName[0]) || 'A' }}</span>
      </a-avatar>
      <template #overlay>
        <a-menu class="profile-menu">
          <a-menu-item class="profile-info-ctn">
            <div class="profile-name">
              {{ fullName }}
            </div>
            <div class="profile-mail">
              {{ loggedUser?.mail }}
            </div>
          </a-menu-item>
          <router-link v-if="secondFAEnabled" :to="{ name: 'ManageSecondFactorAuthentication' }">
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

<script lang="ts" setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { logout } from '@/modules/auth/services/basic';
import { signOut as logoutOIDC } from '@/modules/auth/services/oidc';
import { isEnable } from '../utils/functionality';

const store = useStore();
const router = useRouter();
const loggedUser = computed(() => store.getters['Auth/getLoggedUser']);
const fullName = computed(() => store.getters['Auth/getLoggedUserFullName']);
const secondFAEnabled = computed(() => {
  const functionality = store.getters['Domain/getLoggedUserFunctionality']('SECOND_FACTOR_AUTHENTICATION');

  return isEnable(functionality);
});

async function logOut() {
  if (loggedUser.value.authWithOIDC) {
    await logoutOIDC();
  } else {
    await logout();
  }

  router.push({ name: 'Login' });
}
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
