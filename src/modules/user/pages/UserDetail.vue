<template>
  <div v-if="user" class="manage-users">
    <PageTitle
      :title="$t('USERS.DETAIL_USER.TITLE')"
      :subtitle="`${user.firstName} ${user.lastName} <${user.mail}>`"
      :breadcrumbs="breadcrumbs"
    >
      <template #subTitlePostfix>
        <div class="delete-user-container">
          <a-popconfirm
            :title="$t('USERS.DETAIL_USER.CONFIRM_DELETE')"
            :ok-text="$t('USERS.DETAIL_USER.YES')"
            :cancel-text="$t('USERS.DETAIL_USER.NO')"
            placement="bottom"
            @confirm="deleteUser"
          >
            <a-button>{{ $t('USERS.DETAIL_USER.DELETE_USER') }}</a-button>
          </a-popconfirm>
        </div>
      </template>
    </PageTitle>

    <a-alert v-if="user.locked" :message="$t('USERS.DETAIL_USER.LOCKED_USER')" type="warning">
      <template #description>
        <p>{{ $t('USERS.DETAIL_USER.LOCKED_USER_DESCRIPTION') }}</p>
        <a-button type="warning" class="unlock-button" @click="unlockUser">
          {{ $t('USERS.DETAIL_USER.UNLOCK') }}
        </a-button>
      </template>
    </a-alert>

    <div class="second-factor-authentication">
      <div>
        <span>{{ $t('2FA.TITLE') }}</span>
        <a-tag :color="user.secondFAEnabled ? 'green' : 'red'">
          {{ user.secondFAEnabled ? $t('USERS.DETAIL_USER.ENABLED') : $t('USERS.DETAIL_USER.DISABLED') }}
        </a-tag>
      </div>
      <a-button v-if="user.secondFAEnabled" class="delete-shared-key-button" @click="confirmRemoveSharedKey">
        {{ $t('2FA.KEY_REMOVAL.BUTTON') }}
      </a-button>
    </div>

    <div class="user-detail">
      <a-tabs>
        <a-tab-pane key="1" :tab="$t('USERS.DETAIL_USER.USER_PROFILE')">
          <UserProfile />
        </a-tab-pane>
        <a-tab-pane key="2" :tab="$t('USERS.DETAIL_USER.PERSONAL_SPACE_QUOTA')">
          <PersonalSpaceQuota />
        </a-tab-pane>
        <a-tab-pane v-if="user.accountType === 'GUEST'" key="3" :tab="$t('USERS.DETAIL_USER.RESTRICTED_CONTACT_LIST')">
          <RestrictedContacts />
        </a-tab-pane>
        <a-tab-pane v-if="user.accountType === 'GUEST'" key="4" :tab="$t('USERS.GUEST_MODERATOR.TAB_TITLE')">
          <GuestModerators />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { createVNode } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { Modal, message } from 'ant-design-vue';
import useBreadcrumbs from '@/core/hooks/useBreadcrumbs';
import { useUserStore } from '@/modules/user/store';
import { APIError } from '@/core/types/APIError';
import { deleteUser2FAKey } from '@/modules/user/services/user-api';

import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import PageTitle from '@/core/components/PageTitle.vue';
import UserProfile from '@/modules/user/components/UserProfile.vue';
import RestrictedContacts from '@/modules/user/components/RestrictedContacts.vue';
import PersonalSpaceQuota from '@/modules/user/components/PersonalSpaceQuota.vue';
import GuestModerators from '@/modules/user/components/GuestModerators.vue';

const { t } = useI18n();
const { params } = useRoute();
const router = useRouter();
const userStore = useUserStore();

const id = params.id as string;
const { user } = storeToRefs(userStore);
const { breadcrumbs } = useBreadcrumbs();

try {
  await userStore.fetchUser(id);
} catch (error) {
  if (error instanceof APIError) {
    message.error(error.getMessage());
  }
}

async function deleteUser() {
  if (!user.value) return;

  try {
    await userStore.deleteUser(user.value);
    message.success(t('MESSAGES.DELETE_SUCCESS'));
    router.push({ name: 'UsersList' });
  } catch (error) {
    message.error((error as APIError).getMessage());
  }
}

async function unlockUser() {
  if (!user.value) return;

  try {
    userStore.setUser({
      ...user.value,
      locked: false,
    });

    await userStore.updateUser(user.value);
    message.success(t('MESSAGES.UPDATE_SUCCESS'));
  } catch (error) {
    message.error((error as APIError).getMessage());
  }
}

async function remove2FAKey() {
  if (!user.value) return;

  try {
    await deleteUser2FAKey(user.value.uuid, user.value.secondFAUuid);
    router.go(0);
  } catch (error) {
    message.error(t('2FA.KEY_REMOVAL.MESSAGE.ERROR'));
  }
}

function confirmRemoveSharedKey() {
  Modal.confirm({
    title: () => t('GENERAL.DELETION'),
    icon: () => createVNode(ExclamationCircleOutlined),
    content: () => t('2FA.KEY_REMOVAL.CONFIRMATION'),
    okText: () => t('GENERAL.DELETE'),
    cancelText: () => t('GENERAL.CANCEL'),
    onOk: remove2FAKey,
  });
}
</script>

<style lang="less" scoped>
.manage-users {
  .user-detail {
    margin-top: 40px;
  }

  .delete-user-container {
    display: inline-block;

    .ant-btn {
      background: @primary-8;
      color: @text-color-inverse;
    }
  }

  .unlock-button {
    @media (min-width: 575px) {
      position: absolute;
      right: 15px;
      top: 15px;
    }

    background: @warning-color;
    color: @text-color;
  }

  .second-factor-authentication {
    margin-top: 30px;
    border: 1px solid #eee;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 4px;

    @media (max-width: 575px) {
      display: block;

      .delete-shared-key-button {
        margin-top: 10px;
      }
    }

    .ant-tag {
      margin-left: 10px;
    }

    .delete-shared-key-button {
      background: @background-color-base;
    }
  }
}
</style>
