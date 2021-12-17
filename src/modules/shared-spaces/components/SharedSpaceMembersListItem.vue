<template>
  <a-list-item>
    <template #actions>
      <SharedSpaceRoleSelect
        :uuid="data.role.uuid"
        :type="data.node?.nodeType"
        @change="handleRoleChange"
      />

      <a-popconfirm
        :title="$t('SHARED_SPACES.MEMBERS.CONFIRM_DELETE')"
        :ok-text="$t('GENERAL.YES')"
        :cancel-text="$t('GENERAL.NO')"
        placement="top"
        @confirm="handleDelete"
      >
        <template #icon>
          <QuestionCircleOutlined />
        </template>
        <a-button
          type="primary"
          :loading="deleting"
          danger
        >
          <template #icon>
            <DeleteFilled />
          </template>
        </a-button>
      </a-popconfirm>
    </template>
    <a-list-item-meta
      :description="data.account?.mail"
    >
      <template #title>
        <div>
          <span class="member-name">{{ displayInfo }}</span>
        </div>
      </template>
      <template #avatar>
        <a-avatar
          shape="circle"
          :size="46"
          class="avatar"
        >
          <span>{{ displayInfo.charAt(0) }}</span>
        </a-avatar>
      </template>
    </a-list-item-meta>
  </a-list-item>
</template>

<script lang='ts' setup>
import { computed, ref } from 'vue';
import { message } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { APIError } from '@/core/types/APIError';
import { DeleteFilled, QuestionCircleOutlined } from '@ant-design/icons-vue';
import { removeSharedSpaceMember, updateSharedSpaceMember } from '../services/shared-space-api';
import SharedSpaceMember from '../types/SharedSpaceMember';
import SharedSpaceRoleSelect from './SharedSpaceRoleSelect.vue';
import SharedSpaceRole from '../types/SharedSpaceRole';

const props = defineProps<{ data: SharedSpaceMember }>();
const emit = defineEmits(['update', 'delete']);
const { t } = useI18n();
const deleting = ref(false);

const displayInfo = computed(() => {
  if (!props.data.account) {
    return '';
  }

  if (props.data.account.firstName || props.data.account.lastName) {
    return `${props.data.account.firstName} ${props.data.account.lastName}`.trim();
  }

  return props.data.account.mail || '';
});

async function handleRoleChange (role: SharedSpaceRole) {
  try {
    if (role) {
      const member = await updateSharedSpaceMember({
        ...props.data,
        role: {
          name: role.name,
          type: role.type,
          uuid: role.uuid
        }
      });

      emit('update', member);
      message.success(t('MESSAGES.UPDATE_SUCCESS'));
    }
  } catch (error) {
    if (error instanceof APIError) {
      message.error(error.getMessage());
    } else {
      console.error(error);
    }
  }
}

async function handleDelete () {
  try {
    deleting.value = true;
    await removeSharedSpaceMember(props.data);
    emit('delete', props.data);
    message.success(t('MESSAGES.DELETE_SUCCESS'));
  } catch (error) {
    if (error instanceof APIError) {
      message.error(error.getMessage());
    } else {
      console.error(error);
    }
  } finally {
    deleting.value = false;
  }
}
</script>

<style lang='less' scoped>
.member-name {
  font-size: 16px;
  font-weight: 600;
}

.avatar {
  background-color: @primary-color;
  color: @component-background;
}
</style>
