<template>
  <a-card flat :bordered="false" class="delete-mail-configuration-card">
    <span class="delete-mail-configuration-card__icon">
      <DeleteIcon width="28" height="28" />
    </span>
    <div class="delete-mail-configuration-card__content">
      <strong>{{ $t('EMAIL_TEMPLATES.DELETE_MODAL.DELETE_MODAL_TITLE') }}</strong>
      <span>{{ $t('EMAIL_TEMPLATES.DELETE_MODAL.DELETE_MODAL_SUBTITLE', { currentDomain: currentDomain.name }) }}</span>
    </div>
    <div class="delete-mail-configuration-card__actions">
      <a-button class="ls-button ls-cancel" type="primary" @click="onCloseModal">{{ $t('GENERAL.CANCEL') }}</a-button>
      <a-button class="ls-button ls-save" type="primary" danger @click="onConfirmDelete">
        <a-spin v-if="loading" />
        <span v-else>{{ $t('GENERAL.YES') }}</span>
      </a-button>
    </div>
  </a-card>
</template>
<script lang="ts" setup>
import DeleteIcon from '@/core/components/icons/delete-icon.vue';
import useEmailTemplatesConfiguration from '@/modules/configuration/pages/email-templates/hooks/useEmailTemplatesConfiguration';
import { useDomainStore } from '@/modules/domain/store';
import { storeToRefs } from 'pinia';

// composable
const { loading, handleDeleteMailConfiguration } = useEmailTemplatesConfiguration();
const domainStore = useDomainStore();
const { currentDomain } = storeToRefs(domainStore);

const emits = defineEmits(['close', 'refresh']);

function onCloseModal() {
  emits('close');
}
async function onConfirmDelete() {
  const result = await handleDeleteMailConfiguration();
  if (result) {
    emits('refresh');
    emits('close');
  }
}
</script>
<style lang="less">
.delete-mail-configuration-card {
  .ant-card-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    border: none;
  }

  &__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 24px;

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
    margin-bottom: 24px;
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
