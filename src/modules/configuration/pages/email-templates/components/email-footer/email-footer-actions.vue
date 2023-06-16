<template>
  <div class="email-footer-actions">
    <div v-if="isShowSubActions" class="email-footer-actions__sub-action">
      <a-button type="default" outline class="ls-button__delete" @click="onDeleteMailFooters">
        <template #icon>
          <DeleteFilled />
        </template>
        {{ $t('GENERAL.DELETE') }}
      </a-button>
    </div>
    <a-button v-else type="primary" @click="emits('create')">
      <template #icon>
        <PlusCircleOutlined />
      </template>
      {{ $t('GENERAL.CREATE') }}
    </a-button>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { PlusCircleOutlined, DeleteFilled } from '@ant-design/icons-vue';
import useEmailTemplatesFooter from '@/modules/configuration/pages/email-templates/hooks/useEmailTemplatesFooter';

// props & emits
const emits = defineEmits(['create']);
// composables
const { selectedMailFooters, onDeleteMailFooters } = useEmailTemplatesFooter();

// computed
const isShowSubActions = computed(() => {
  return !!selectedMailFooters?.value?.length;
});
</script>
<style lang="less">
.email-footer-actions {
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
