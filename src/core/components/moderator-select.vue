<script lang="ts">
export interface ModeratorSelectOption {
  label: string;
  value: string;
  disabled: boolean;
  data: User;
}
</script>

<script lang="ts" setup>
import { ref } from 'vue';
import { APIError } from '@/core/types/APIError';
import { listAllUsers } from '@/modules/user/services/user-api';
import { getUserFullName } from '@/modules/user/services/user-utils';
import { useDebounceFn } from '@vueuse/core';
import { message } from 'ant-design-vue';
import { UserOutlined } from '@ant-design/icons-vue';
import User from '@/modules/user/types/User';
import { useDomainStore } from '@/modules/domain/store';

const domainStore = useDomainStore();

const currentDomainUuid = domainStore.currentDomain.uuid;
const topMostDomain = domainStore.topMostDomain;

interface Props {
  disableChecker: (user: User) => boolean;
  userDomain: string;
}

const options = ref([] as ModeratorSelectOption[]);
const searchUsersDebounce = useDebounceFn(searchUsers, 500);
const searching = ref(false);
const emit = defineEmits(['select', 'deselect']);
const props = withDefaults(defineProps<Props>(), {
  disableChecker: () => false,
});

async function searchUsers(search: string) {
  searching.value = true;
  try {
    const data = await listAllUsers(search, {
      domain: props.userDomain,
      accountType: 'INTERNAL',
    });
    options.value = data.map((user) => ({
      label: getUserFullName(user),
      value: user.mail,
      disabled: props.disableChecker(user),
      data: user,
    }));
  } catch (error) {
    if (error instanceof APIError) {
      return message.error(error.getMessage());
    }

    console.warn(error);
  } finally {
    searching.value = false;
  }
}

function onModeratorSelect(_: string, option: ModeratorSelectOption) {
  emit('select', option);
}

function onModeratorDeselect(_: string, option: ModeratorSelectOption) {
  emit('deselect', option);
}
</script>

<template>
  <a-select
    mode="multiple"
    :options="options"
    :placeholder="$t('USERS.MANAGE_USERS.EMAIL')"
    @search="searchUsersDebounce"
    @select="onModeratorSelect"
    @deselect="onModeratorDeselect"
  >
    <template #option="{ value, label }">
      <UserOutlined class="user-icon" />
      <span>
        <span>{{ label }}</span>
        <span>&nbsp;</span>
        <span>&lt;{{ value }}&gt;</span>
      </span>
    </template>

    <template #notFoundContent>
      <div class="not-found">
        <a-spin v-if="searching" class="spinner" size="small" />

        <span v-else>{{ $t('USERS.DETAIL_USER.NO_USER_FOUND') }}</span>
      </div>
    </template>
  </a-select>
</template>

<style lang="less" scoped>
.spinner {
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
}

.user-icon {
  color: @primary-color;
  margin-right: 4px;
}

.not-found {
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
