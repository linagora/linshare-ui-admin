<script setup lang="ts">
import { createVNode } from 'vue';
import { deleteUser2FAKey } from '@/modules/user/services/user-api';
import { APIError } from '@/core/types/APIError';
import { message, Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { useI18n } from 'vue-i18n';
import type User from '@/modules/user/types/User';

const props = defineProps<{ user: User }>();
const emit = defineEmits(['delete']);
const { t } = useI18n();

async function remove2FAKey() {
  try {
    await deleteUser2FAKey(props.user.uuid, props.user.secondFAUuid);
    emit('delete');
  } catch (error) {
    if (error instanceof APIError) {
      message.error(error.getMessage());
    }
  }
}

function confirmRemoveSharedKey() {
  Modal.confirm({
    title: () => t('GENERAL.DELETION'),
    icon: () => createVNode(ExclamationCircleOutlined),
    content: () => t('2FA.KEY_REMOVAL.CONFIRMATION'),
    okText: () => t('GENERAL.DELETE'),
    cancelText: () => t('GENERAL.CANCEL'),
    onOk: remove2FAKey,
  });
}
</script>

<template>
  <div class="second-factor-authentication">
    <div>
      <span>{{ $t('2FA.TITLE') }}</span>
      <a-tag :color="user?.secondFAEnabled ? 'green' : 'red'">
        {{ user?.secondFAEnabled ? $t('USERS.DETAIL_USER.ENABLED') : $t('USERS.DETAIL_USER.DISABLED') }}
      </a-tag>
    </div>
    <a-button v-if="user.secondFAEnabled" class="delete-shared-key-button" @click="confirmRemoveSharedKey">
      {{ $t('2FA.KEY_REMOVAL.BUTTON') }}
    </a-button>
  </div>
</template>

<style lang="less" scoped>
.second-factor-authentication {
  margin-top: 30px;
  border: 1px solid #eee;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 4px;

  @media (max-width: 575px) {
    display: block;

    .delete-shared-key-button {
      margin-top: 10px;
    }
  }

  .ant-tag {
    margin-left: 10px;
  }

  .delete-shared-key-button {
    background: @background-color-base;
  }
}
</style>
