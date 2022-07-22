<script lang="ts" setup>
import { computed, createVNode, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { Modal, message } from 'ant-design-vue';
import useBreadcrumbs from '@/core/hooks/useBreadcrumbs';
import { APIError } from '@/core/types/APIError';
import { deleteUser, deleteUser2FAKey, getUser, updateUser } from '@/modules/user/services/user-api';

import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import PageTitle from '@/core/components/PageTitle.vue';
import UserProfile from '@/modules/user/components/UserProfile.vue';
import UserRestrictedContacts from '@/modules/user/components/UserRestrictedContacts.vue';
import UserPersonalSpaceQuota from '@/modules/user/components/UserPersonalSpaceQuota.vue';
import UserGuestModerators from '@/modules/user/components/UserGuestModerators.vue';
import User from '../types/User';
import StatusValue from '@/core/types/Status';

const { push, currentRoute } = useRouter();
const { t } = useI18n();
const { breadcrumbs } = useBreadcrumbs();
const user = ref<User | undefined>();
const pageStatus = ref<StatusValue>(StatusValue.LOADING);
const pageSubtitle = computed(() =>
  user.value ? `${user.value.firstName} ${user.value.lastName} <${user.value.mail}>` : ''
);

async function remove() {
  if (!user.value) return;

  try {
    await deleteUser(user.value);
    message.success(t('MESSAGES.DELETE_SUCCESS'));
    push({ name: 'UsersList' });
  } catch (error) {
    if (error instanceof APIError) {
      message.error(error.getMessage());
    }
  }
}

async function unlockUser() {
  if (!user.value) return;

  try {
    user.value = await updateUser({
      ...user.value,
      locked: false,
    });
    message.success(t('MESSAGES.UPDATE_SUCCESS'));
  } catch (error) {
    if (error instanceof APIError) {
      message.error(error.getMessage());
    }
  }
}

async function remove2FAKey() {
  if (!user.value) return;

  try {
    await deleteUser2FAKey(user.value.uuid, user.value.secondFAUuid);
    prepare();
  } catch (error) {
    if (error instanceof APIError) {
      message.error(error.getMessage());
    }
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

async function prepare() {
  pageStatus.value = StatusValue.LOADING;

  try {
    user.value = await getUser(currentRoute.value.params.id as string);
    pageStatus.value = StatusValue.SUCCESS;
  } catch (error) {
    pageStatus.value = StatusValue.ERROR;

    if (error instanceof APIError) {
      message.error(error.getMessage());
    }
  }
}

watchEffect(() => {
  if (currentRoute.value.params.id) {
    prepare();
  }
});
</script>

<template>
  <PageTitle :title="$t('USERS.DETAIL_USER.TITLE')" :subtitle="pageSubtitle" :breadcrumbs="breadcrumbs">
    <template #subTitlePostfix>
      <div v-if="pageStatus === StatusValue.SUCCESS" class="delete-user-container">
        <a-popconfirm
          :title="$t('USERS.DETAIL_USER.CONFIRM_DELETE')"
          :ok-text="$t('USERS.DETAIL_USER.YES')"
          :cancel-text="$t('USERS.DETAIL_USER.NO')"
          placement="bottom"
          @confirm="remove"
        >
          <a-button>{{ $t('USERS.DETAIL_USER.DELETE_USER') }}</a-button>
        </a-popconfirm>
      </div>
    </template>
  </PageTitle>

  <div v-if="pageStatus === StatusValue.LOADING" class="spinner">
    <a-spin />
  </div>

  <div v-if="pageStatus === StatusValue.SUCCESS">
    <a-alert v-if="user?.locked" :message="$t('USERS.DETAIL_USER.LOCKED_USER')" type="warning">
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
        <a-tag :color="user?.secondFAEnabled ? 'green' : 'red'">
          {{ user?.secondFAEnabled ? $t('USERS.DETAIL_USER.ENABLED') : $t('USERS.DETAIL_USER.DISABLED') }}
        </a-tag>
      </div>
      <a-button v-if="user?.secondFAEnabled" class="delete-shared-key-button" @click="confirmRemoveSharedKey">
        {{ $t('2FA.KEY_REMOVAL.BUTTON') }}
      </a-button>
    </div>

    <div v-if="user" class="user-detail">
      <a-tabs>
        <a-tab-pane key="1" :tab="$t('USERS.DETAIL_USER.USER_PROFILE')">
          <UserProfile :user="user" @update="(updated) => (user = updated)" />
        </a-tab-pane>
        <a-tab-pane key="2" :tab="$t('USERS.DETAIL_USER.PERSONAL_SPACE_QUOTA')">
          <UserPersonalSpaceQuota :user="user" />
        </a-tab-pane>
        <a-tab-pane v-if="user.accountType === 'GUEST'" key="3" :tab="$t('USERS.DETAIL_USER.RESTRICTED_CONTACT_LIST')">
          <UserRestrictedContacts :user="user" />
        </a-tab-pane>
        <a-tab-pane v-if="user.accountType === 'GUEST'" key="4" :tab="$t('USERS.GUEST_MODERATOR.TAB_TITLE')">
          <UserGuestModerators :user="user" />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<style lang="less" scoped>
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
.spinner {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
