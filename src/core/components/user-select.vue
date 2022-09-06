<script lang="ts">
export interface UserSelectOption {
  label: string;
  value: string;
  disabled: boolean;
  data: User;
}
</script>

<script lang="ts" setup>
import { ref } from 'vue';
import { APIError } from '@/core/types/APIError';
import { SORT_ORDER } from '@/core/types/Sort';
import { listUsers } from '@/modules/user/services/user-api';
import { getUserFullName } from '@/modules/user/services/user-utils';
import { useDebounceFn } from '@vueuse/core';
import { message } from 'ant-design-vue';
import { UserOutlined } from '@ant-design/icons-vue';
import User from '@/modules/user/types/User';

interface Props {
  disableChecker: (user: User) => boolean;
}

const options = ref([] as UserSelectOption[]);
const searchUsersDebounce = useDebounceFn(searchUsers, 500);
const searching = ref(false);
const emit = defineEmits(['select', 'deselect']);
const props = withDefaults(defineProps<Props>(), {
  disableChecker: () => false,
});

async function searchUsers(search: string) {
  searching.value = true;
  try {
    const { data } = await listUsers({
      mail: search,
      sortOrder: SORT_ORDER.ASC,
      sortField: 'mail',
      type: 'INTERNAL',
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

function onUserSelect(_: string, option: UserSelectOption) {
  emit('select', option);
}

function onUserDeselect(_: string, option: UserSelectOption) {
  emit('deselect', option);
}
</script>

<template>
  <a-select
    mode="multiple"
    :options="options"
    :placeholder="$t('USERS.MANAGE_USERS.EMAIL')"
    @search="searchUsersDebounce"
    @select="onUserSelect"
    @deselect="onUserDeselect"
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
