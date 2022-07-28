<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import useBreadcrumbs from '@/core/hooks/useBreadcrumbs';
import { APIError } from '@/core/types/APIError';
import { deleteUser, getUser } from '@/modules/user/services/user-api';

import PageTitle from '@/core/components/PageTitle.vue';
import UserProfile from '@/modules/user/components/UserProfile.vue';
import UserRestrictedContacts from '@/modules/user/components/UserRestrictedContacts.vue';
import UserPersonalSpaceQuota from '@/modules/user/components/UserPersonalSpaceQuota.vue';
import UserGuestModerators from '@/modules/user/components/UserGuestModerators.vue';
import UserSharedKeyAlert from '@/modules/user/components/UserSharedKeyAlert.vue';
import UserLockedAlert from '@/modules/user/components/UserLockedAlert.vue';
import StatusValue from '@/core/types/Status';
import type User from '@/modules/user/types/User';

const { push, currentRoute, replace } = useRouter();
const { t } = useI18n();
const { breadcrumbs } = useBreadcrumbs();
const user = ref<User | undefined>();
const isGuestUser = computed(() => user.value?.accountType === 'GUEST');
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

async function prepare() {
  pageStatus.value = StatusValue.LOADING;

  try {
    user.value = await getUser(currentRoute.value.params.id as string);
    pageStatus.value = StatusValue.SUCCESS;
  } catch (error) {
    pageStatus.value = StatusValue.ERROR;

    if (error instanceof APIError) {
      message.error(error.getMessage());

      if (error.errorCode === 2200) {
        replace({ name: 'UsersList' });
      }
    }
  }
}

watchEffect(() => {
  if (currentRoute.value.params.id && currentRoute.value.name === 'UserDetail') {
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

  <div v-if="user && pageStatus === StatusValue.SUCCESS">
    <UserLockedAlert :user="user" @unlock="user && (user.locked = false)" />
    <UserSharedKeyAlert :user="user" @delete="user && (user.secondFAEnabled = false)" />

    <div class="user-detail">
      <a-tabs>
        <a-tab-pane key="1" :tab="$t('USERS.DETAIL_USER.USER_PROFILE')">
          <UserProfile :user="user" @update="(updated) => (user = updated)" />
        </a-tab-pane>
        <a-tab-pane key="2" :tab="$t('USERS.DETAIL_USER.PERSONAL_SPACE_QUOTA')">
          <UserPersonalSpaceQuota :user="user" />
        </a-tab-pane>
        <a-tab-pane v-if="isGuestUser" key="3" :tab="$t('USERS.DETAIL_USER.RESTRICTED_CONTACT_LIST')">
          <UserRestrictedContacts :user="user" />
        </a-tab-pane>
        <a-tab-pane v-if="isGuestUser" key="4" :tab="$t('USERS.GUEST_MODERATOR.TAB_TITLE')">
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

.spinner {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
