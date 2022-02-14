<template>
  <a-modal
    :visible="visible"
    :title="$t('SHARED_SPACES.MEMBERS.ADD_NEW')"
    @cancel="emit('cancel')"
  >
    <template #footer>
      <a-button @click="() => { reset(); emit('cancel'); }">
        {{ $t('GENERAL.CANCEL') }}
      </a-button>

      <a-button
        type="primary"
        :disabled="usersToBeAdded.length === 0"
        :loading="creating"
        @click="createMembers"
      >
        <template #icon>
          <PlusCircleOutlined />
        </template>
        Add
      </a-button>
    </template>

    <a-form
      :label-col="{ span: 24 }"
      :wrapper-col="{ span: 24 }"
    >
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
              <a-spin
                v-if="searching"
                class="spinner"
                size="small"
              />

              <span v-else>{{ $t('USERS.DETAIL_USER.NO_USER_FOUND') }}</span>
            </div>
          </template>
        </a-select>
      </a-form-item>

      <a-form-item :label="$t('GENERAL.ROLE')">
        <SharedSpaceRoleSelect
          :type="sharedSpace.nodeType"
          :uuid="selectedRole.uuid"
          @change="setSelectedRole"
        />
      </a-form-item>

      <a-form-item
        v-if="sharedSpace.nodeType === SHARED_SPACE_TYPE.WORKSPACE"
        :label="$t('SHARED_SPACES.MEMBERS.DEFAULT_WORKGROUP_ROLE')"
      >
        <SharedSpaceRoleSelect
          :type="SHARED_SPACE_TYPE.WORKGROUP"
          :uuid="nestedRole.uuid"
          @change="setNestedRole"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang='ts' setup>
import { APIError } from '@/core/types/APIError';
import { SORT_ORDER } from '@/core/types/Sort';
import { listUsers } from '@/modules/user/services/user-api';
import { getUserFullName } from '@/modules/user/services/user-utils';
import { useDebounceFn } from '@vueuse/core';
import { message } from 'ant-design-vue';
import { PlusCircleOutlined, UserOutlined } from '@ant-design/icons-vue';
import { reactive, ref } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { createSharedSpaceMember } from '../services/shared-space-api';
import SharedSpaceRoleSelect from './SharedSpaceRoleSelect.vue';
import User from '@/modules/user/types/User';
import SharedSpaceRole from '../types/SharedSpaceRole';
import SharedSpace, { SHARED_SPACE_TYPE } from '../types/SharedSpace';
import SharedSpaceMember from '../types/SharedSpaceMember';

interface Props {
  sharedSpace: SharedSpace;
  members: SharedSpaceMember[];
  visible: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['membersAdded', 'cancel']);
const store = useStore();
const { t } = useI18n();

const selectedRole = reactive<SharedSpaceRole>({
  ...store.getters['SharedSpace/getRolesByType'](props.sharedSpace.nodeType)[0]
});
const nestedRole = reactive<SharedSpaceRole>({
  ...store.getters['SharedSpace/getRolesByType'](SHARED_SPACE_TYPE.WORKGROUP)[0]
});
const setSelectedRole = (role: SharedSpaceRole) => Object.assign(selectedRole, role);
const setNestedRole = (role: SharedSpaceRole) => Object.assign(nestedRole, role);
const creating = ref(false);

interface Option {
  label: string;
  value: string;
  disabled: boolean;
  data: User;
}
const options = ref([] as Option[]);
const usersToBeAdded = ref([] as User[]);
const searching = ref(false);
const searchUsersDebounce = useDebounceFn(searchUsers, 500);

async function searchUsers (search: string) {
  searching.value = true;

  try {
    const { data } = await listUsers({
      mail: search,
      sortOrder: SORT_ORDER.ASC,
      sortField: 'mail',
      type: 'INTERNAL'
    });

    options.value = data
      .map(user => ({
        label: getUserFullName(user),
        value: user.mail,
        disabled: props.members.some(member => member.account.uuid === user.uuid),
        data: user
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

function onUserSelect (_: string, option: Option) {
  usersToBeAdded.value.push(option.data);
}

function onUserDeselect (_: string, option: Option) {
  usersToBeAdded.value = usersToBeAdded.value.filter(user => user.uuid !== option.data.uuid);
}

async function createMembers () {
  try {
    creating.value = true;

    const promises: Promise<SharedSpaceMember>[] = [];

    usersToBeAdded.value.forEach(user => promises.push(createSharedSpaceMember(transform(user))));

    await Promise.all(promises);

    message.success(t('MESSAGES.CREATE_SUCCESS'));
    emit('membersAdded');
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

function transform (user: User): SharedSpaceMember {
  return {
    uuid: '',
    role: {
      name: selectedRole.name,
      type: selectedRole.type,
      uuid: selectedRole.uuid
    },
    account: {
      uuid: user.uuid,
      mail: user.mail,
      firstName: user.firstName,
      lastName: user.lastName
    },
    node: {
      uuid: props.sharedSpace.uuid,
      name: props.sharedSpace.name,
      nodeType: props.sharedSpace.nodeType
    }
  };
}

function reset () {
  creating.value = false;
  usersToBeAdded.value = [];
}
</script>

<style lang='less' scoped>
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
