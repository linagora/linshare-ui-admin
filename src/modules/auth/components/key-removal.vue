<template>
  <a-alert v-if="secondFA?.enabled && !secondFA?.canDeleteIt" type="warning">
    <template #description>
      <h1>{{ $t('2FA.KEY_REMOVAL.ALERT.TITLE') }}</h1>
      <span>{{ $t('2FA.KEY_REMOVAL.ALERT.MESSAGE') }}</span>
    </template>
  </a-alert>

  <div class="second-fa-management">
    <span class="helper-text">{{ $t('2FA.KEY_REMOVAL.HELPER') }}</span>

    <div v-if="secondFA?.creationDate" class="shared-key">
      <small>{{ $t('2FA.KEY_REMOVAL.INFORMATION', { date: $d(secondFA.creationDate, 'mediumDate') }) }}</small>
    </div>

    <a-button v-if="secondFA?.canDeleteIt" type="primary" class="button" @click="confirmRemoval">
      {{ $t('2FA.KEY_REMOVAL.BUTTON') }}
    </a-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, createVNode } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/modules/auth/store';
import { Modal, message } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  name: 'KeyRemoval',
  setup() {
    const { t } = useI18n();
    const router = useRouter();
    const authStore = useAuthStore();
    const { secondFA } = storeToRefs(authStore);

    async function remove2FAKey() {
      try {
        await authStore.removeSecondFA();
        router.go(0);
      } catch (error) {
        message.error(t('2FA.KEY_REMOVAL.MESSAGE.ERROR'));
      }
    }

    function confirmRemoval() {
      Modal.confirm({
        title: () => t('GENERAL.DELETION'),
        icon: () => createVNode(ExclamationCircleOutlined),
        content: () => t('2FA.KEY_REMOVAL.CONFIRMATION'),
        okText: () => t('GENERAL.DELETE'),
        cancelText: () => t('GENERAL.CANCEL'),
        onOk: remove2FAKey,
      });
    }

    return {
      confirmRemoval,
      secondFA,
    };
  },
});
</script>
