<template>
  <a-modal
    :visible="visible"
    :title="$t('SHARED_SPACES.MEMBERS.ADD_NEW')"
    :destroy-on-close="true"
    @cancel="emit('cancel')"
  >
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

      <a-button type="primary" :disabled="usersToBeAdded.length === 0" :loading="creating" @click="createMembers">
        <template #icon>
          <PlusCircleOutlined />
        </template>
        Add
      </a-button>
    </template>

    <a-form :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
      <a-form-item :label="$t('SHARED_SPACES.MEMBERS.NEW')">
        <UserSelect :disable-checker="disableCurrentMember" @select="onSelect" @deselect="onDeselect" />
      </a-form-item>
      <a-form-item :label="$t('GENERAL.ROLE')">
        <SharedSpaceRoleSelect :type="sharedSpace.nodeType" :uuid="selectedRole.uuid" @change="setSelectedRole" />
      </a-form-item>

      <a-form-item
        v-if="sharedSpace.nodeType === SHARED_SPACE_TYPE.WORKSPACE"
        :label="$t('SHARED_SPACES.MEMBERS.DEFAULT_WORKGROUP_ROLE')"
      >
        <SharedSpaceRoleSelect :type="SHARED_SPACE_TYPE.WORKGROUP" :uuid="nestedRole.uuid" @change="setNestedRole" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { APIError } from '@/core/types/APIError';
import { message } from 'ant-design-vue';
import { PlusCircleOutlined } from '@ant-design/icons-vue';
import { reactive, ref } from 'vue';
import { useSharedSpacesStore } from '@/modules/shared-spaces/store';
import { useI18n } from 'vue-i18n';
import { createSharedSpaceMember } from '../services/shared-space-api';
import SharedSpaceRoleSelect from './SharedSpaceRoleSelect.vue';
import User from '@/modules/user/types/User';
import SharedSpaceRole from '../types/SharedSpaceRole';
import SharedSpace, { SHARED_SPACE_TYPE } from '../types/SharedSpace';
import SharedSpaceMember from '../types/SharedSpaceMember';
import UserSelect, { UserSelectOption } from '@/core/components/UserSelect.vue';

interface Props {
  sharedSpace: SharedSpace;
  visible: boolean;
  members: SharedSpaceMember[];
}

const props = defineProps<Props>();
const emit = defineEmits(['membersAdded', 'cancel']);
const sharedSpacesStore = useSharedSpacesStore();
const { t } = useI18n();

const selectedRole = reactive<SharedSpaceRole>({
  ...sharedSpacesStore.getRolesByType(props.sharedSpace.nodeType)[0],
});
const nestedRole = reactive<SharedSpaceRole>({
  ...sharedSpacesStore.getRolesByType(SHARED_SPACE_TYPE.WORKGROUP)[0],
});
const setSelectedRole = (role: SharedSpaceRole) => Object.assign(selectedRole, role);
const setNestedRole = (role: SharedSpaceRole) => Object.assign(nestedRole, role);
const creating = ref(false);
const usersToBeAdded = ref([] as User[]);

function disableCurrentMember(user: User) {
  return props.members.some((member) => member.account.uuid === user.uuid);
}

async function createMembers() {
  try {
    creating.value = true;

    const promises: Promise<SharedSpaceMember>[] = [];

    usersToBeAdded.value.forEach((user) => promises.push(createSharedSpaceMember(transform(user))));

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

function onSelect(selectedUser: UserSelectOption) {
  usersToBeAdded.value.push(selectedUser.data);
}

function onDeselect(deselectedUser: UserSelectOption) {
  usersToBeAdded.value = usersToBeAdded.value.filter((user) => user.uuid !== deselectedUser.data.uuid);
}

function transform(user: User): SharedSpaceMember {
  return {
    uuid: '',
    role: {
      name: selectedRole.name,
      type: selectedRole.type,
      uuid: selectedRole.uuid,
    },
    account: {
      uuid: user.uuid,
      mail: user.mail,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    node: {
      uuid: props.sharedSpace.uuid,
      name: props.sharedSpace.name,
      nodeType: props.sharedSpace.nodeType,
    },
  };
}

function reset() {
  creating.value = false;
  usersToBeAdded.value = [];
}
</script>
