<script lang="ts" setup>
import { computed, ref, watchEffect, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import useBreadcrumbs from '@/core/hooks/useBreadcrumbs';
import { APIError } from '@/core/types/APIError';
import { deleteUser, getUser } from '@/modules/user/services/user-api';
import PageTitle from '@/core/components/page-title.vue';
import UserProfile from '@/modules/user/components/user-profile.vue';
import UserRestrictedContacts from '@/modules/user/components/user-restricted-contacts.vue';
import UserPersonalSpaceQuota from '@/modules/user/components/user-personal-space-quota.vue';
import UserGuestModerators from '@/modules/user/components/user-guest-moderators.vue';
import UserSharedKeyAlert from '@/modules/user/components/user-shared-key-alert.vue';
import CurrentUserGuest from '@/modules/user/components/current-user-guests.vue';
import UserLockedAlert from '@/modules/user/components/user-locked-alert.vue';
import { STATUS } from '@/core/types/Status';
import { GuestListFilters } from '@/modules/user/types/GuestList';
import type User from '@/modules/user/types/User';
import useGuestList from '@/modules/user/hooks/useGuestList';
import ThePagination from '@/core/components/the-pagination.vue';
import { useMediaQuery } from '@vueuse/core';
import { LARGE_SCREEN_BREAK_POINT } from '@/core/constants/breakpoint';
import CurrentUserGuestSmallTable from '../components/current-user-guests-small-table.vue';
import TokenInput, { TokenSubmitPayload } from '@/core/components/token-input.vue';
import { ADMINISTRATIONS_TEMPLATES_ROUTE_NAMES } from '@/modules/administration/router';

const { push, currentRoute, replace } = useRouter();
const isLargeScreen = useMediaQuery(LARGE_SCREEN_BREAK_POINT);
const { locale, t } = useI18n();
const { breadcrumbs } = useBreadcrumbs();
const { list, pagination, handleTableChange, filters, sorter } = useGuestList();
const user = ref<User | undefined>();
const isGuestUser = computed(() => user.value?.accountType === 'GUEST');
const isInternalUser = computed(() => user.value?.accountType === 'INTERNAL');
const pageStatus = ref<STATUS>(STATUS.LOADING);
const pageSubtitle = computed(() =>
  user.value ? `${user.value.firstName} ${user.value.lastName} <${user.value.mail}>` : ''
);

async function remove() {
  if (!user.value) return;

  try {
    await deleteUser(user.value);
    message.success(t('MESSAGES.DELETE_SUCCESS'));
    push({ name: ADMINISTRATIONS_TEMPLATES_ROUTE_NAMES.MY_USERS_ROUTE_NAMES.USER_LIST });
  } catch (error) {
    if (error instanceof APIError) {
      message.error(error.getMessage());
    }
  }
}
const filterOptions = [
  {
    key: 'pattern',
    displayKey: computed(() => t('USERS.DETAIL_USER.ADVANCED_RESEARCH', locale.value)),
    default: true,
  },
  {
    key: 'role',
    displayKey: computed(() => t('GENERAL.ROLE', locale.value)),
    options: [
      {
        label: computed(() => t('USERS.DETAIL_USER.ROLE_ADMIN', locale.value)),
        value: 'ADMIN',
      },
      {
        label: computed(() => t('USERS.DETAIL_USER.ROLE_SIMPLE', locale.value)),
        value: 'SIMPLE',
      },
    ],
  },
];
const sortOptions = [
  {
    key: 'firstName',
    label: 'USERS.DETAIL_USER.FIRST_NAME',
    default: true,
  },
];

async function prepare() {
  pageStatus.value = STATUS.LOADING;

  try {
    user.value = await getUser(currentRoute.value.params.id as string);
    pageStatus.value = STATUS.SUCCESS;
  } catch (error) {
    pageStatus.value = STATUS.ERROR;

    if (error instanceof APIError) {
      message.error(error.getMessage());

      if (error.errorCode === 2200) {
        replace({ name: ADMINISTRATIONS_TEMPLATES_ROUTE_NAMES.MY_USERS_ROUTE_NAMES.USER_LIST });
      }
    }
  }
}

const handleSubmit = async function (options: TokenSubmitPayload<GuestListFilters>) {
  if (options.sort) {
    Object.assign(sorter, options.sort);
  }

  filters.value = options.filters;

  await handleTableChange();
};

watchEffect(() => {
  if (currentRoute.value.params.id && currentRoute.value.name === 'UserDetail') {
    prepare();
  }
});

onMounted(handleTableChange);
</script>

<template>
  <PageTitle :title="$t('USERS.DETAIL_USER.TITLE')" :subtitle="pageSubtitle" :breadcrumbs="breadcrumbs">
    <template #subTitlePostfix>
      <div v-if="pageStatus === STATUS.SUCCESS" class="delete-user-container">
        <a-popconfirm
          :title="$t('USERS.DETAIL_USER.CONFIRM_DELETE')"
          :ok-text="$t('USERS.DETAIL_USER.YES')"
          :cancel-text="$t('USERS.DETAIL_USER.NO')"
          placement="bottom"
          overlay-class-name="popconfirm-delete"
          @confirm="remove"
        >
          <a-button>{{ $t('USERS.DETAIL_USER.DELETE_USER') }}</a-button>
        </a-popconfirm>
      </div>
    </template>
  </PageTitle>

  <div v-if="pageStatus === STATUS.LOADING" class="spinner">
    <a-spin />
  </div>

  <div v-if="user && pageStatus === STATUS.SUCCESS">
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
        <a-tab-pane v-if="isInternalUser" key="5" :tab="$t('FUNCTIONALITIES.DETAILS.GUESTS.NAME')">
          <TokenInput
            :filters="filterOptions"
            :sorts="sortOptions"
            :placeholder="$t('USERS.TOKEN_INPUT.PLACEHOLDER')"
            @submit="handleSubmit"
          />
          <CurrentUserGuest v-if="isLargeScreen" :list="list" />
          <CurrentUserGuestSmallTable v-else :list="list" />
          <ThePagination v-model="pagination" :is-visible="!!list.length" @change="() => handleTableChange()" />
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
<style lang="less">
.popconfirm-delete {
  max-width: 350px;
  min-width: 350px;
}
</style>
