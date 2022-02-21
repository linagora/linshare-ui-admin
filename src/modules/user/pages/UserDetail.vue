<template>
  <div class="manage-users">
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

    <a-alert
      v-if="user.locked"
      :message="$t('USERS.DETAIL_USER.LOCKED_USER')"
      type="warning"
    >
      <template #description>
        <p>{{ $t('USERS.DETAIL_USER.LOCKED_USER_DESCRIPTION') }}</p>
        <a-button
          type="warning"
          class="unlock-button"
          @click="unlockUser"
        >
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
      <a-button
        v-if="user.secondFAEnabled"
        class="delete-shared-key-button"
        @click="confirmRemoveSharedKey"
      >
        {{ $t('2FA.KEY_REMOVAL.BUTTON') }}
      </a-button>
    </div>

    <div class="user-detail">
      <a-tabs>
        <a-tab-pane
          key="1"
          :tab="$t('USERS.DETAIL_USER.USER_PROFILE')"
        >
          <UserProfile />
        </a-tab-pane>
        <a-tab-pane
          key="2"
          :tab="$t('USERS.DETAIL_USER.PERSONAL_SPACE_QUOTA')"
        >
          <PersonalSpaceQuota />
        </a-tab-pane>
        <a-tab-pane
          v-if="user.accountType === 'GUEST'"
          key="3"
          :tab="$t('USERS.DETAIL_USER.RESTRICTED_CONTACT_LIST')"
        >
          <RestrictedContacts />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, createVNode } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { Modal, message } from 'ant-design-vue';
import router from '@/core/router';
import store from '@/core/store';
import useBreadcrumbs from '@/core/hooks/useBreadcrumbs';
import PageTitle from '@/core/components/PageTitle.vue';
import UserProfile from '@/modules/user/components/UserProfile.vue';
import RestrictedContacts from '@/modules/user/components/RestrictedContacts.vue';
import PersonalSpaceQuota from '@/modules/user/components/PersonalSpaceQuota.vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { deleteUser2FAKey } from '../services/user-api';
import User from '../types/User';
import { APIError } from '@/core/types/APIError';

export default defineComponent({
  name: 'UserDetail',
  components: {
    PageTitle,
    PersonalSpaceQuota,
    UserProfile,
    RestrictedContacts
  },
  async setup () {
    const { params } = useRoute();
    const { t } = useI18n();

    const id = params.id;
    const user = computed<User>(() => store.getters['User/getUser']);
    const { breadcrumbs } = useBreadcrumbs();

    try {
      await store.dispatch('User/fetchUser', id);
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      } else {
        console.error(error);
      }
    }

    async function deleteUser () {
      try {
        await store.dispatch('User/deleteUser', store.getters['User/getUser']);
        message.success(t('MESSAGES.DELETE_SUCCESS'));
        router.push({ name: 'UsersList' });
      } catch (error) {
        message.error((error as APIError).getMessage());
      }
    }

    async function unlockUser () {
      try {
        store.dispatch('User/setUser', {
          ...store.getters['User/getUser'],
          locked: false
        });

        await store.dispatch('User/updateUser', store.getters['User/getUser']);
        message.success(t('MESSAGES.UPDATE_SUCCESS'));
      } catch (error) {
        message.error((error as APIError).getMessage());
      }
    }

    async function remove2FAKey () {
      try {
        const user = store.getters['User/getUser'];

        await deleteUser2FAKey(user.uuid, user.secondFAUuid);
        router.go(0);
      } catch (error) {
        message.error(t('2FA.KEY_REMOVAL.MESSAGE.ERROR'));
      }
    }

    function confirmRemoveSharedKey () {
      Modal.confirm({
        title: () => t('GENERAL.DELETION'),
        icon: () => createVNode(ExclamationCircleOutlined),
        content: () => t('2FA.KEY_REMOVAL.CONFIRMATION'),
        okText: () => t('GENERAL.DELETE'),
        cancelText: () => t('GENERAL.CANCEL'),
        onOk: remove2FAKey
      });
    }

    return {
      user,
      breadcrumbs,
      deleteUser,
      confirmRemoveSharedKey,
      unlockUser
    };
  }
});
</script>

<style lang='less' scoped>
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
