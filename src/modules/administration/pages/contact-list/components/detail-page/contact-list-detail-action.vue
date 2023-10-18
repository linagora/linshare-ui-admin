<template>
  <div v-if="editable" class="contact-list-detail-action">
    <a-button :disabled="loading" type="primary" class="ls-button ls-filled" @click="emits('save')">
      <a-spin v-if="loading"></a-spin>
      <span v-else>{{ $t('GENERAL.SAVE') }}</span>
    </a-button>
    <a-button class="ls-button ls-reset" @click="emits('reset')">
      {{ $t('GENERAL.RESET') }}
    </a-button>
    <a-button class="ls-button ls-delete" @click="emits('delete')">
      {{ $t('GENERAL.DELETE') }}
    </a-button>
  </div>
</template>
<script setup lang="ts">
// props & emits
const emits = defineEmits(['save', 'cancel', 'reset', 'delete']);
const props = defineProps<{
  editable?: boolean;
  editing?: boolean;
  loading?: boolean;
}>();

function onCancel() {
  emits('cancel');
  emits('reset');
}
</script>
<style lang="less">
.contact-list-detail-action {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;

  .ls-button {
    padding: 0px 20px;
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

  .ls-delete {
    color: #ea3c3c;
  }

  .ls-reset {
    color: #007aff;
  }
}
</style>
