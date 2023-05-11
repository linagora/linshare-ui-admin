<template>
  <a-card flat :bordered="false" class="delete-mail-configurations-card">
    <span class="delete-mail-configurations-card__icon">
      <DeleteIcon />
    </span>
    <div class="delete-mail-configurations-card__content">
      <strong>{{ $t('EMAIL_TEMPLATES.DELETE_MODAL.DELETE_SELECTED_MAIL_CONFIGURATION') }}</strong>
      <span>{{
        $t('EMAIL_TEMPLATES.DELETE_MODAL.DELETE_SELECTED_MAIL_CONFIGURATION_SUBTITLE', {
          qty: selectedMailConfigs?.length ?? 0,
        })
      }}</span>
    </div>
    <div class="delete-mail-configurations-card__actions">
      <a-button class="ls-button ls-cancel" type="primary" @click="onCloseModal">{{
        $t('EMAIL_TEMPLATES.DELETE_MODAL.DELETE_ACTION_CANCEL')
      }}</a-button>
      <a-button class="ls-button ls-save" type="primary" danger @click="onConfirmDelete">
        <a-spin v-if="loading" />
        <span v-else>{{ $t('EMAIL_TEMPLATES.DELETE_MODAL.DELETE_ACTION_CONFIRM') }}</span>
      </a-button>
    </div>
  </a-card>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import DeleteIcon from '@/core/components/icons/delete-icon.vue';
import useEmailTemplatesConfiguration from '@/modules/configuration/pages/email-templates/hooks/useEmailTemplatesConfiguration';

// composable
const { t } = useI18n();
const { handleDeleteMailConfigurations, onDeleteMailConfigurationsFail, selectedMailConfigs, loading } =
  useEmailTemplatesConfiguration();

const emits = defineEmits(['close', 'refresh']);

function onCloseModal() {
  emits('close');
}

async function onConfirmDelete() {
  const result = await handleDeleteMailConfigurations();
  if (result.totalSuccess === result.total) {
    emits('refresh');
    emits('close');
  } else {
    onDeleteMailConfigurationsFail(result);
  }
}
</script>
<style lang="less">
.delete-mail-configurations-card {
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
