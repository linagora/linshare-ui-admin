<template>
  <div class="mime-policies-actions">
    <a-button v-if="!isShowSubActions" type="primary" @click="emits('create')">
      <template #icon>
        <PlusCircleOutlined />
      </template>
      {{ $t('GENERAL.CREATE') }}
    </a-button>
    <div v-else class="mime-policies-actions__sub-action">
      <a-button type="default" outline class="ls-button__isolate">
        <template #icon>
          <EyeOutlined />
        </template>
        {{ $t('GENERAL.ISOLATE') }}
      </a-button>
      <a-button type="default" outline class="ls-button__undo">
        <template #icon>
          <UndoOutlined />
        </template>
        {{ $t('GENERAL.UNDO') }}
      </a-button>
      <a-button type="default" outline class="ls-button__delete" @click="onDeleteMimePolicies">
        <template #icon>
          <DeleteFilled />
        </template>
        {{ $t('GENERAL.DELETE') }}
      </a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import useMimesPolicies from '@/modules/configuration/pages/type-mime-policies/hooks/useMimePolicies';
import { PlusCircleOutlined, EyeOutlined, UndoOutlined, DeleteFilled } from '@ant-design/icons-vue';

// props & emits
const emits = defineEmits(['create']);
// composables
const { selectedMimePolicies, onDeleteMimePolicies } = useMimesPolicies();

// computed
const isShowSubActions = computed(() => {
  return !!selectedMimePolicies?.value?.length;
});
</script>
<style lang="less">
.mime-policies-actions {
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
