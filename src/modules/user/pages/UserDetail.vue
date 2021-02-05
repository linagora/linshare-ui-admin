<template>
  <div class="manage-users">
    <PageTitle
      :title="$t('USERS.MANAGE_USERS.TITLE')"
      :subtitle="`${data.firstName} ${data.lastName} <${data.mail}>`"
    >
    </PageTitle>
    <div class="delete-user-container">
      <a-popconfirm
        :title="$t('USERS.DETAIL_USER.CONFIRM_DELETE')"
        :ok-text="$t('USERS.DETAIL_USER.YES')"
        :cancel-text="$t('USERS.DETAIL_USER.NO')"
        @confirm="deleteUser"
      >
        <a-button>{{ $t('USERS.DETAIL_USER.DELETE_USER') }}</a-button>
      </a-popconfirm>
    </div>

    <a-alert
      v-if="data.locked"
      :message="$t('USERS.DETAIL_USER.LOCKED_USER')"
      type="warning"
    >
      <template #description>
        <p>{{ $t('USERS.DETAIL_USER.LOCKED_USER_DESCRIPTION') }}</p>
        <a-button type='warning' class="unlock-button" @click="unlockUser">
          {{ $t('USERS.DETAIL_USER.UNLOCK')}}
        </a-button>
      </template>
    </a-alert>

    <div class="second-factor-authentication">
      <div>
        <span>{{ $t('2FA.TITLE') }}</span>
        <a-tag :color="data.secondFAEnabled ? 'green' : 'red'">
          {{ data.secondFAEnabled ? $t('USERS.DETAIL_USER.ENABLED') : $t('USERS.DETAIL_USER.DISABLED') }}
        </a-tag>
      </div>
      <a-button class="delete-shared-key-button" v-if='data.secondFAEnabled' @click="confirmRemoveSharedKey">
        {{ $t('2FA.KEY_REMOVAL.BUTTON')}}
      </a-button>
    </div>

    <div class="user-detail">
      <a-tabs>
        <a-tab-pane key="1" :tab="$t('USERS.DETAIL_USER.USER_PROFILE')">
          <UserProfile />
        </a-tab-pane>
        <a-tab-pane key="2" :tab="$t('USERS.DETAIL_USER.PERSONAL_SPACE_QUOTA')">
        </a-tab-pane>
        <a-tab-pane key="3" :tab="$t('USERS.DETAIL_USER.UPLOAD_REQUEST')">
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
import PageTitle from '@/core/components/PageTitle.vue';
import UserProfile from '@/modules/user/components/UserProfile.vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import UserAPIClient from '../services/UserAPIClient';

export default defineComponent({
  name: 'UserDetail',
  components: {
    PageTitle,
    UserProfile
  },
  async setup () {
    const id = useRoute().params.id;
    const { t } = useI18n();
    let data;
    try {
      await store.dispatch('User/fetchUser', id);
      data = computed(() => store.getters['User/getUser']);
    } catch (error) {
      message.error(error.message || t('ERRORS.COMMON_MESSAGE'));
    }

    async function deleteUser () {
      try {
        await store.dispatch('User/deleteUser', store.getters['User/getUser']);
        message.success(t('MESSAGES.DELETE_SUCCESS'));
        router.push({ name: 'Users' });
      } catch (error) {
        message.error(error.message || t('ERRORS.COMMON_MESSAGE'));
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
        message.error(error.message || t('ERRORS.COMMON_MESSAGE'));
      }
    }

    async function remove2FAKey () {
      try {
        const user = store.getters['User/getUser'];

        await UserAPIClient.remove2FAKey(user.uuid, user.secondFAUuid);
        router.go(0);
      } catch (error) {
        message.error(t('2FA.KEY_REMOVAL.MESSAGE.ERROR'));
      }
    }

    function confirmRemoveSharedKey () {
      Modal.confirm({
        title: t('GENERAL.DELETION'),
        icon: createVNode(ExclamationCircleOutlined),
        content: t('2FA.KEY_REMOVAL.CONFIRMATION'),
        okText: t('GENERAL.DELETE'),
        cancelText: t('GENERAL.CANCEL'),
        onOk: remove2FAKey
      });
    }

    return {
      data,
      deleteUser,
      confirmRemoveSharedKey,
      unlockUser
    };
  }
});
</script>

<style lang='less' scoped>
  @import '@/assets/styles/variables';

  .manage-users {
    .user-detail {
      margin-top: 40px;
    }

    .alert-message-in-description {
      display: block;
      margin-top: 10px;
      margin-bottom: 4px;
      color: rgba(0, 0, 0, 0.85);
      font-size: 16px;
    }

    .delete-user-container {
      @media (min-width: 575px) {
        position: absolute;
        right: 40px;
        top: 60px;
      }

      @media (max-width: 574px) {
        margin-top: -20px;
        margin-bottom: 30px;
      }

      .ant-btn {
        background: #1B4157;
        color: #fff;
        border-radius: 4px;
        &:hover, &:focus {
          outline: none !important;
          border: 1px solid #1f4d67;
        }
      }
    }

    .unlock-button {
      @media (min-width: 575px) {
        position: absolute;
        right: 15px;
        top: 15px;
      }

      background: #FFE58F;
      color: #333;
      border-radius: 4px;
      &:hover, &:focus {
        border: 1px solid #fbe392;
        outline: none !important;
      }
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
        background: #F2F5F7;
        color: #333;
        border-radius: 4px;
        border: 0px;
        font-weight: 600;
      }
    }
  }
</style>
