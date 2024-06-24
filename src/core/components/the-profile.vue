<script lang="ts" setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import useProfile from '@/core/hooks/useProfile';
import { useAuthStore } from '@/modules/auth/store';
import { isEnable } from '@/core/utils/functionality';
import { logout } from '@/modules/auth/services/basic';
import { signOut as logoutOIDC } from '@/modules/auth/services/oidc';
import UserProfileIcon from '@/core/components/icons/user-profile-icon.vue';
import { useReportingSharesStore, useReportingStore } from '@/modules/reporting/store';
import { ACCOUNT_ROLE } from '@/modules/user/types/User';

// composables
const { push } = useRouter();
const authStore = useAuthStore();
const { current, onClose } = useProfile();
const reportingStore = useReportingStore();
const reportingSharesStore = useReportingSharesStore();
const { loggedUser, loggedUserFullName, functionalities } = storeToRefs(authStore);

// computed
const secondFAEnabled = computed(() => isEnable(functionalities.value.SECOND_FACTOR_AUTHENTICATION));

// methods
async function logOut() {
  if (loggedUser.value?.authWithOIDC) {
    await logoutOIDC();
  } else {
    await logout();
  }
  reportingStore.$reset();
  reportingSharesStore.$reset();
  push({ name: 'Login' });
}

const isSuperAdmin = computed(() => {
  return loggedUser;
});
</script>

<template>
  <div class="the-profile">
    <div class="user">
      <a-dropdown :trigger="['click']">
        <user-profile-icon></user-profile-icon>
        <template #overlay>
          <a-menu v-model:selectedKeys="current" class="profile-menu">
            <a-menu-item class="profile-info-ctn">
              <div class="profile-name">
                {{ loggedUserFullName }}
              </div>
              <div class="profile-mail">
                {{ loggedUser?.mail }}
              </div>
            </a-menu-item>
            <a-menu-item v-if="secondFAEnabled" key="second_factor_authentication" @click="onClose">
              <router-link :to="{ name: 'ManageSecondFactorAuthentication' }" class="link">
                <span class="name">{{ $t('HEADER.PROFILE.2FA') }}</span>
              </router-link>
            </a-menu-item>
            <a-menu-item v-if="isSuperAdmin" key="change_password" @click="onClose">
              <router-link :to="{ name: 'ManageChangePassword' }" class="link">
                <span class="name">{{ $t('HEADER.PROFILE.CHANGE_PASSWORD') }}</span>
              </router-link>
            </a-menu-item>
            <a-menu-item key="logout" @click="logOut">
              <a name="logout" class="link">
                <span class="name">{{ $t('HEADER.PROFILE.LOGOUT') }}</span>
              </a>
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
