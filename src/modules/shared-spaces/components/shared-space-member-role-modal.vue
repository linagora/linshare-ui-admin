<script lang="ts" setup>
import { APIError } from '@/core/types/APIError';
import { CheckOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { reactive, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { updateSharedSpaceMember } from '../services/shared-space-api';
import { SHARED_SPACE_TYPE } from '../types/SharedSpace';
import SharedSpaceMember from '../types/SharedSpaceMember';
import SharedSpaceRole from '../types/SharedSpaceRole';
import SharedSpaceRoleSelect from './shared-space-role-select.vue';

interface Props {
  member: SharedSpaceMember;
  visible: boolean;
}

const { t } = useI18n();
const emit = defineEmits(['roleUpdated', 'cancel']);
const props = defineProps<Props>();
const role = reactive<SharedSpaceRole>({ ...props.member.role });
const nestedRole = reactive<SharedSpaceRole | Record<string, never>>(
  props.member.nestedRole ? { ...props.member.nestedRole } : {}
);
const force = ref(false);
const saving = ref(false);

const setRole = (r: SharedSpaceRole) => Object.assign(role, r);
const setNestedRole = (r: SharedSpaceRole) => Object.assign(nestedRole, r);

async function saveMemberRole() {
  saving.value = true;

  try {
    const payload: SharedSpaceMember = {
      ...props.member,
      role: {
        name: role.name,
        type: role.type,
        uuid: role.uuid,
      },
    };

    if (nestedRole.uuid) {
      payload.nestedRole = {
        name: nestedRole.name,
        type: nestedRole.type,
        uuid: nestedRole.uuid,
      };
    }

    const member = await updateSharedSpaceMember(payload, force.value);

    emit('roleUpdated', member);
    message.success(t('MESSAGES.UPDATE_SUCCESS'));
  } catch (error) {
    if (error instanceof APIError) {
      message.error(error.getMessage());
    } else {
      console.error(error);
    }
  } finally {
    saving.value = false;
  }
}

watchEffect(() => {
  if (props.visible) {
    Object.assign(role, props.member.role);

    if (props.member.nestedRole) {
      Object.assign(nestedRole, props.member.nestedRole);
    }
  }
});
</script>

<template>
  <a-modal
    :visible="visible"
    :title="$t('SHARED_SPACES.MEMBERS.ROLE_EDIT_TITLE', { name: member.account.firstName })"
    @cancel="emit('cancel')"
  >
    <template #footer>
      <a-button @click="emit('cancel')">
        {{ $t('GENERAL.CANCEL') }}
      </a-button>

      <a-button type="primary" :loading="saving" @click="saveMemberRole">
        <template #icon>
          <CheckOutlined />
        </template>
        {{ $t('GENERAL.SAVE') }}
      </a-button>
    </template>
    <a-form :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
      <a-form-item :label="$t('GENERAL.ROLE')">
        <SharedSpaceRoleSelect :type="member.node.nodeType" :uuid="role.uuid" @change="setRole" />
      </a-form-item>

      <a-form-item v-if="nestedRole.uuid" :label="$t('SHARED_SPACES.MEMBERS.DEFAULT_WORKGROUP_ROLE')">
        <SharedSpaceRoleSelect :type="SHARED_SPACE_TYPE.WORKGROUP" :uuid="nestedRole.uuid" @change="setNestedRole" />
      </a-form-item>

      <a-form-item v-if="nestedRole.uuid">
        <a-checkbox v-model:checked="force">
          {{ $t('SHARED_SPACES.MEMBERS.FORCE_CHECKBOX') }}
        </a-checkbox>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
