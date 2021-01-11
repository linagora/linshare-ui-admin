<template>
  <a-alert v-if="secondFA.enabled && !secondFA.canDeleteIt" type="warning">
    <template #description>
      <h1>{{ $t('2FA.KEY_REMOVAL.ALERT.TITLE') }}</h1>
      <span>{{ $t('2FA.KEY_REMOVAL.ALERT.MESSAGE') }}</span>
    </template>
  </a-alert>

  <div class="second-fa-management">
    <span class="helper-text">{{ $t('2FA.KEY_REMOVAL.HELPER') }}</span>

    <div class="shared-key">
      <small>{{ $t('2FA.KEY_REMOVAL.INFORMATION', { date:  formatDate(secondFA.creationDate, 'mediumDate', locale) }) }}</small>
    </div>

    <a-button
      v-if="secondFA.canDeleteIt"
      type="primary"
      class="button"
      @click="confirmRemoval"
    >
      {{ $t('2FA.KEY_REMOVAL.BUTTON') }}
    </a-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, createVNode } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { Modal, message } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { formatDate } from '@/core/utils/date';

export default defineComponent({
  name: 'KeyRemoval',
  setup () {
    const { locale, t } = useI18n();
    const router = useRouter();
    const store = useStore();

    async function remove2FAKey () {
      try {
        await store.dispatch('Auth/removeSecondFA');
        router.go(0);
      } catch (error) {
        message.error(t('2FA.KEY_REMOVAL.MESSAGE.ERROR'));
      }
    }

    function confirmRemoval () {
      Modal.confirm({
        title: t('GENERAL.DELETION'),
        icon: createVNode(ExclamationCircleOutlined),
        content: t('2FA.KEY_REMOVAL.CONFIRMATION'),
        okText: t('GENERAL.DELETE'),
        cancelText: t('GENERAL.CANCEL'),
        onOk: remove2FAKey
      });
    }

    return {
      locale,
      confirmRemoval,
      formatDate,
      secondFA: computed(() => store.getters['Auth/getSecondFA'])
    };
  }
});
</script>
