<script lang="ts" setup>
import { computed } from 'vue';
import { useAuthStore } from '@/modules/auth/store';
import { useRouter } from 'vue-router';
import { logout } from '@/modules/auth/services/basic';
import { signOut as logoutOIDC } from '@/modules/auth/services/oidc';
import { isEnable } from '@/core/utils/functionality';
import { storeToRefs } from 'pinia';
import UserProfileIcon from '@/core/components/icons/user-profile-icon.vue';

const router = useRouter();
const authStore = useAuthStore();
const { loggedUser, loggedUserFullName, functionalities } = storeToRefs(authStore);
const secondFAEnabled = computed(() => isEnable(functionalities.value.SECOND_FACTOR_AUTHENTICATION));

async function logOut() {
  if (loggedUser.value?.authWithOIDC) {
    await logoutOIDC();
  } else {
    await logout();
  }

  router.push({ name: 'Login' });
}
</script>

<template>
  <div class="the-profile">
    <div class="user">
      <a-dropdown :trigger="['click']">
        <user-profile-icon></user-profile-icon>
        <template #overlay>
          <a-menu class="profile-menu">
            <a-menu-item class="profile-info-ctn">
              <div class="profile-name">
                {{ loggedUserFullName }}
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
  </div>
</template>

<style lang="less" scoped>
.the-profile {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;

  .config {
    margin-right: 16px;
    cursor: pointer;
  }

  .user {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .user .ant-dropdown-trigger {
    outline: none;
    border: none;
  }
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
