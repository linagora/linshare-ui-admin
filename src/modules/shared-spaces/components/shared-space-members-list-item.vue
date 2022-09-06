<template>
  <a-list-item>
    <template #actions>
      <a-button type="primary" @click="$emit('editRole')">
        {{ $t('GENERAL.EDIT') }}
        <template #icon>
          <EditOutlined />
        </template>
      </a-button>

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
        <a-button type="primary" :loading="deleting" danger>
          <template #icon>
            <DeleteFilled />
          </template>
        </a-button>
      </a-popconfirm>
    </template>
    <a-list-item-meta>
      <template #title>
        <span class="member-name">{{ displayInfo }}</span>
        <span class="member-mail">{{ data.account?.mail }}</span>
      </template>
      <template #description>
        <a-tag color="green">
          {{ $t(`SHARED_SPACES.ROLE.${data.role.name}`) }}
        </a-tag>
        <a-tag v-if="data.nestedRole" color="cyan">
          <a-tooltip>
            <template #title>
              {{ $t('SHARED_SPACES.MEMBERS.DEFAULT_ROLE_TAG_TOOLTIP') }}
            </template>
            {{
              `${$t('SHARED_SPACES.MEMBERS.DEFAULT_ROLE_TAG_PREFIX')} ${$t(
                `SHARED_SPACES.ROLE.${data.nestedRole?.name}`
              )}`
            }}
          </a-tooltip>
        </a-tag>
      </template>
      <template #avatar>
        <a-avatar shape="circle" :size="46" class="avatar">
          <span>{{ displayInfo.charAt(0) }}</span>
        </a-avatar>
      </template>
    </a-list-item-meta>
  </a-list-item>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { message } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { APIError } from '@/core/types/APIError';
import { DeleteFilled, QuestionCircleOutlined, EditOutlined } from '@ant-design/icons-vue';
import { removeSharedSpaceMember } from '../services/shared-space-api';
import SharedSpaceMember from '../types/SharedSpaceMember';

const props = defineProps<{ data: SharedSpaceMember }>();
const emit = defineEmits(['deleted', 'editRole']);
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

async function handleDelete() {
  try {
    deleting.value = true;
    await removeSharedSpaceMember(props.data);
    emit('deleted', props.data);
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

<style lang="less" scoped>
.member-name {
  font-size: 16px;
  font-weight: 600;
  margin-right: 5px;
}

.member-mail {
  color: @text-color-secondary;
}

.avatar {
  background-color: @primary-color;
  color: @component-background;
}
</style>
