<template>
  <div class="contact-list-actions">
    <a-button type="primary" @click="emits('sort')">
      <template #icon>
        <SortAscendingOutlined />
      </template>
      {{ $t('GENERAL.SORT') }}
    </a-button>
  </div>
</template>
<script lang="ts" setup>
import { SortAscendingOutlined } from '@ant-design/icons-vue';

// props & emits
const emits = defineEmits(['sort']);
</script>
<style lang="less">
.contact-list-actions {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;

  &__sub-action {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
  }

  .ls-button__isolate,
  .ls-button__undo {
    color: #007aff;
  }

  .ls-button__delete {
    color: #007aff;

    svg {
      color: #ea3c3c;
    }
  }
}
</style>
