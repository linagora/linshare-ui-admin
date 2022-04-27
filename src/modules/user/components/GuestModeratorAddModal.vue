<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { message } from 'ant-design-vue';
import { useDebounceFn } from '@vueuse/core';
import { PlusCircleOutlined, UserOutlined } from '@ant-design/icons-vue';
import { APIError } from '@/core/types/APIError';
import { SORT_ORDER } from '@/core/types/Sort';
import { listUsers } from '@/modules/user/services/user-api';
import { getUserFullName } from '@/modules/user/services/user-utils';
import GuestModerator, { GUEST_MODERATOR_ROLE } from '../types/GuestModerator';
import User from '@/modules/user/types/User';
import { createGuestModerator } from '../services/guest-api';

interface Props {
  moderators: GuestModerator[];
  visible: boolean;
}

interface Option {
  label: string;
  value: string;
  disabled: boolean;
  data: User;
}

const props = defineProps<Props>();
const emit = defineEmits(['moderatorsAdded', 'cancel']);
const store = useStore();
const { t } = useI18n();
const currentUser = computed<User>(() => store.getters['User/getUser']);
const selectedRole = ref<GUEST_MODERATOR_ROLE>(GUEST_MODERATOR_ROLE.SIMPLE);
const adding = ref(false);
const options = ref([] as Option[]);
const moderatorsToBeAdded = ref([] as User[]);
const searching = ref(false);
const searchUsersDebounce = useDebounceFn(searchUsers, 500);

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
      disabled: props.moderators.some((moderator) => moderator.account.uuid === user.uuid),
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

function onUserSelect(_: string, option: Option) {
  moderatorsToBeAdded.value.push(option.data);
}

function onUserDeselect(_: string, option: Option) {
  moderatorsToBeAdded.value = moderatorsToBeAdded.value.filter((user) => user.uuid !== option.data.uuid);
}

async function addModerator() {
  try {
    adding.value = true;

    const promises: Promise<GuestModerator>[] = [];

    moderatorsToBeAdded.value.forEach((user) =>
      promises.push(createGuestModerator(currentUser.value.uuid, transform(user)))
    );

    await Promise.all(promises);

    message.success(t('MESSAGES.CREATE_SUCCESS'));
    emit('moderatorsAdded');
  } catch (error) {
    if (error instanceof APIError) {
      message.error(error.getMessage());
    } else {
      console.error(error);
    }
  } finally {
    reset();
  }
}

function transform(user: User): GuestModerator {
  return {
    uuid: '',
    role: selectedRole.value,
    account: {
      uuid: user.uuid,
    },
    guest: {
      uuid: currentUser.value.uuid,
    },
  };
}

function reset() {
  adding.value = false;
  moderatorsToBeAdded.value = [];
}
</script>

<template>
  <a-modal :visible="visible" :title="$t('SHARED_SPACES.MEMBERS.ADD_NEW')" @cancel="emit('cancel')">
    <template #footer>
      <a-button
        @click="
          () => {
            reset();
            emit('cancel');
          }
        "
      >
        {{ $t('GENERAL.CANCEL') }}
      </a-button>

      <a-button type="primary" :disabled="moderatorsToBeAdded.length === 0" :loading="adding" @click="addModerator">
        <template #icon>
          <PlusCircleOutlined />
        </template>
        {{ $t('GENERAL.ADD') }}
      </a-button>
    </template>

    <a-form :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
      <a-form-item :label="$t('SHARED_SPACES.MEMBERS.NEW')">
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
      </a-form-item>

      <a-form-item :label="$t('GENERAL.ROLE')">
        <a-select v-model:value="selectedRole">
          <a-select-option :value="GUEST_MODERATOR_ROLE.ADMIN">{{
            $t('USERS.GUEST_MODERATOR.ROLE.ADMIN')
          }}</a-select-option>

          <a-select-option :value="GUEST_MODERATOR_ROLE.SIMPLE">{{
            $t('USERS.GUEST_MODERATOR.ROLE.SIMPLE')
          }}</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
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
