<template>
  <div class="mail-configuration-actions">
    <div v-if="isShowSubActions" class="mail-configuration-actions__sub-action">
      <a-button type="default" outline class="ls-button__delete" @click="onDeleteMailLayouts">
        <template #icon>
          <DeleteFilled />
        </template>
        {{ $t('GENERAL.DELETE') }}
      </a-button>
    </div>
    <a-button type="primary" @click="emits('create')">
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
import useEmailTemplatesLayout from '@/modules/configuration/pages/email-templates/hooks/useEmailTemplatesLayout';

// props & emits
const emits = defineEmits(['create']);
// composables
const { selectedMailLayouts, onDeleteMailLayouts } = useEmailTemplatesLayout();

// computed
const isShowSubActions = computed(() => {
  return !!selectedMailLayouts?.value?.length;
});
</script>
<style lang="less">
.mail-configuration-actions {
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
