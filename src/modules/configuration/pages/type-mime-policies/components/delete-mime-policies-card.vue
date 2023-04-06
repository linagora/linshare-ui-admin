<template>
  <a-card flat :bordered="false" class="delete-mime-policies-card">
    <span class="delete-mime-policies-card__icon">
      <DeleteIcon />
    </span>
    <div class="delete-mime-policies-card__content">
      <strong>{{ $t('MIME_POLICIES.DELETE_MODAL.DELETE_MUTIPLE_MODAL_TITLE') }}</strong>
      <span>{{
        $t('MIME_POLICIES.DELETE_MODAL.DELETE_MUTIPLE_MODAL_SUBTITLE', { qty: selectedMimePolicies?.length ?? 0 })
      }}</span>
    </div>
    <div class="delete-mime-policies-card__actions">
      <a-button class="ls-button ls-cancel" type="primary" @click="onCloseModal">{{
        $t('MIME_POLICIES.DELETE_MODAL.DELETE_ACTION_CANCEL')
      }}</a-button>
      <a-button class="ls-button ls-save" type="primary" danger @click="onConfirmDelete">
        <a-spin v-if="loading" />
        <span v-else>{{ $t('MIME_POLICIES.DELETE_MODAL.DELETE_ACTION_CONFIRM') }}</span>
      </a-button>
    </div>
  </a-card>
</template>
<script lang="ts" setup>
import DeleteIcon from '@/core/components/icons/delete-icon.vue';
import useMimeType from '@/modules/configuration/pages/type-mime-policies/hooks/useMimePolicies';

// composable
const { handleDeleteMimePolicies, onShowDeleteMimePoliciesFail, selectedMimePolicies, loading } = useMimeType();

const emits = defineEmits(['close', 'refresh']);

function onCloseModal() {
  emits('close');
}
async function onConfirmDelete() {
  const result = await handleDeleteMimePolicies();
  if (result) {
    emits('refresh');
    emits('close');
  } else {
    onShowDeleteMimePoliciesFail();
  }
}
</script>
<style lang="less">
.delete-mime-policies-card {
  .ant-card-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    gap: 24px;
    border: none;
  }

  &__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    strong {
      font-weight: 600;
      font-size: 20px;
      line-height: 24px;
      text-align: center;
      color: #434657;
    }

    span {
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      text-align: center;
      letter-spacing: -0.01em;
      color: #6d7885;
    }
  }

  &__icon {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ea3c3c;
    width: 68px;
    height: 68px;
    background: #fbecec;
    border-radius: 16px;
    margin: 0 auto;
  }

  &__actions {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 12px;

    .ls-button {
      flex-grow: 1;
    }

    .ls-cancel,
    .ls-cancel:hover {
      background-color: #f3f3f7;
      color: #007aff;
      border-color: #f3f3f7;
    }
  }
}
</style>
