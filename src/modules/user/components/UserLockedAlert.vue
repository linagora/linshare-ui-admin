<script setup lang="ts">
import { APIError } from '@/core/types/APIError';
import { message } from 'ant-design-vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { updateUser } from '../services/user-api';
import User from '../types/User';

const props = defineProps<{ user: User }>();
const emit = defineEmits(['unlock']);
const { t } = useI18n();
const unlocking = ref(false);

async function unlockUser() {
  try {
    unlocking.value = true;
    await updateUser({
      ...props.user,
      locked: false,
    });
    message.success(t('MESSAGES.UPDATE_SUCCESS'));
    emit('unlock');
  } catch (error) {
    if (error instanceof APIError) {
      message.error(error.getMessage());
    }
  }

  unlocking.value = false;
}
</script>

<template>
  <a-alert v-if="user.locked" :message="$t('USERS.DETAIL_USER.LOCKED_USER')" type="warning">
    <template #description>
      <p>{{ $t('USERS.DETAIL_USER.LOCKED_USER_DESCRIPTION') }}</p>
      <a-button type="warning" class="unlock-button" :loading="unlocking" @click="unlockUser">
        {{ $t('USERS.DETAIL_USER.UNLOCK') }}
      </a-button>
    </template>
  </a-alert>
</template>

<style lang="less" scoped>
.unlock-button {
  @media (min-width: 575px) {
    position: absolute;
    right: 15px;
    top: 15px;
  }

  background: @warning-color;
  color: @text-color;
}
</style>
