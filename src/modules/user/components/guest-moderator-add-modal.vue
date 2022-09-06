<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { message } from 'ant-design-vue';
import { PlusCircleOutlined } from '@ant-design/icons-vue';
import { APIError } from '@/core/types/APIError';
import GuestModerator, { GUEST_MODERATOR_ROLE } from '../types/GuestModerator';
import User from '@/modules/user/types/User';
import { createGuestModerator } from '../services/guest-api';
import UserSelect, { UserSelectOption } from '@/core/components/user-select.vue';

interface Props {
  user: User;
  moderators: GuestModerator[];
  visible: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['moderatorsAdded', 'cancel']);
const { t } = useI18n();
const selectedRole = ref<GUEST_MODERATOR_ROLE>(GUEST_MODERATOR_ROLE.SIMPLE);
const adding = ref(false);
const moderatorsToBeAdded = ref([] as User[]);

function onSelect(selectedUser: UserSelectOption) {
  moderatorsToBeAdded.value.push(selectedUser.data);
}

function onDeselect(deselectedUser: UserSelectOption) {
  moderatorsToBeAdded.value = moderatorsToBeAdded.value.filter((user) => user.uuid !== deselectedUser.data.uuid);
}

async function addModerator() {
  try {
    adding.value = true;

    const promises: Promise<GuestModerator>[] = [];

    moderatorsToBeAdded.value.forEach((user) => promises.push(createGuestModerator(props.user.uuid, transform(user))));

    await Promise.all(promises);

    message.success(t('MESSAGES.CREATE_SUCCESS'));
    emit('moderatorsAdded');
  } catch (error) {
    if (error instanceof APIError) {
      message.error(error.getMessage());
    }
  }

  reset();
}

function disableExistingModerator(user: User) {
  return props.moderators.some((moderator) => moderator.account.uuid === user.uuid);
}

function transform(user: User): GuestModerator {
  return {
    uuid: '',
    role: selectedRole.value,
    account: {
      uuid: user.uuid,
    },
    guest: {
      uuid: props.user.uuid,
    },
  };
}

function reset() {
  adding.value = false;
  moderatorsToBeAdded.value = [];
}
</script>

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

      <a-button type="primary" :disabled="moderatorsToBeAdded.length === 0" :loading="adding" @click="addModerator">
        <template #icon>
          <PlusCircleOutlined />
        </template>
        {{ $t('GENERAL.ADD') }}
      </a-button>
    </template>

    <a-form :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
      <a-form-item :label="$t('SHARED_SPACES.MEMBERS.NEW')">
        <UserSelect :disable-checker="disableExistingModerator" @select="onSelect" @deselect="onDeselect" />
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
