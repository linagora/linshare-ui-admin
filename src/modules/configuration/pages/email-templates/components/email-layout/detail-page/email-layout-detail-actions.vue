<template>
  <div v-if="editing && editable" class="email-layout-detail-action">
    <a-button :disabled="loading || !isEnableSaveButton" type="primary" class="ls-button" @click="emits('save')">
      <a-spin v-if="loading"></a-spin>
      <span v-else>{{ $t('GENERAL.SAVE') }}</span>
    </a-button>
    <a-button class="ls-button ls-cancel" @click="onCancel">
      {{ $t('GENERAL.CANCEL') }}
    </a-button>
    <a-button class="ls-button ls-reset" @click="emits('reset')">
      {{ $t('GENERAL.RESET') }}
    </a-button>
  </div>
</template>
<script setup lang="ts">
import useEmailTemplatesLayout from '@/modules/configuration/pages/email-templates/hooks/useEmailTemplatesLayout';
import { computed } from 'vue';

// props & emits
const emits = defineEmits(['save', 'cancel', 'reset']);
const props = defineProps<{
  editable?: boolean;
  editing?: boolean;
  loading?: boolean;
}>();

const { activeMailLayout } = useEmailTemplatesLayout();
const isEnableSaveButton = computed(() => {
  return (
    activeMailLayout.value.description &&
    activeMailLayout.value.description?.trim()?.length > 0 &&
    activeMailLayout.value.layout &&
    activeMailLayout.value.layout?.trim()?.length > 0
  );
});

function onCancel() {
  emits('cancel');
}
</script>
<style lang="less">
.email-layout-detail-action {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
  margin-top: 20px;

  .ls-button {
    padding: 0px 20px;
    width: 88px;
    min-width: 88px;
    height: 44px;
    border-radius: 8px;
  }

  .ls-filled {
    background-color: #007aff;
    color: #f3f3f7;

    .ant-spin {
      color: #f3f3f7;
    }

    .ant-spin-dot-item {
      background-color: #f3f3f7;
    }
  }

  .ls-reset {
    color: #ea3c3c;
  }

  .ls-cancel {
    color: #007aff;
  }
}
</style>
