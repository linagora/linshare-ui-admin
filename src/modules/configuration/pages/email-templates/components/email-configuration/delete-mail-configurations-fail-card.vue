<template>
  <a-card flat :bordered="false" class="delete-mail-configurations-fail-card">
    <span class="delete-mail-configurations-fail-card__icon">
      <warning-icon width="36" height="36"></warning-icon>
    </span>
    <div class="delete-mail-configurations-fail-card__content">
      <strong>{{ $t('EMAIL_TEMPLATES.DELETE_MODAL.DELETE_FAILURE') }}</strong>
      <span>{{ deleteMessage }}</span>
    </div>
    <div class="delete-mail-configurations-fail-card__actions">
      <a-button class="ls-button ls-cancel" type="primary" @click="onCloseModal">{{ $t('GENERAL.OK') }}</a-button>
    </div>
  </a-card>
</template>
<script lang="ts" setup>
import WarningIcon from '@/core/components/icons/warning-icon.vue';
import { computed } from 'vue';
import useEmailTemplatesConfiguration from '@/modules/configuration/pages/email-templates/hooks/useEmailTemplatesConfiguration';
import { useI18n } from 'vue-i18n';

// composable
const { t } = useI18n();
const { modal } = useEmailTemplatesConfiguration();
//props & emits
const emits = defineEmits(['close', 'refresh']);

//computed

const deleteMessage = computed(() => {
  if (modal.multipleDeleteResponse?.total === 1) {
    if (modal.multipleDeleteResponse?.totalAssignCases === 1) {
      return t('EMAIL_TEMPLATES.DELETE_MODAL.DELETE_ERROR_ASSIGNED');
    } else if (modal.multipleDeleteResponse?.totalUnAuthoCases === 1) {
      return t('EMAIL_TEMPLATES.DELETE_MODAL.DELETE_ERROR_UNAUTHORIZED');
    } else {
      return t('EMAIL_TEMPLATES.DELETE_MODAL.DELETE_ERROR_ONE');
    }
  } else if (modal.multipleDeleteResponse?.total === modal?.multipleDeleteResponse?.totalFail) {
    if (modal.multipleDeleteResponse?.totalAssignCases === modal.multipleDeleteResponse?.totalFail) {
      return t('EMAIL_TEMPLATES.DELETE_MODAL.DELETE_ERROR_ASSIGNED_ALL');
    } else if (modal.multipleDeleteResponse?.totalUnAuthoCases === modal.multipleDeleteResponse?.totalFail) {
      return t('EMAIL_TEMPLATES.DELETE_MODAL.DELETE_ERROR_UNAUTHORIZED_ALL');
    } else {
      return t('EMAIL_TEMPLATES.DELETE_MODAL.DELETE_ERROR_ALL');
    }
  } else {
    if (modal?.multipleDeleteResponse?.totalAssignCases && modal?.multipleDeleteResponse?.totalAssignCases > 0) {
      return t('EMAIL_TEMPLATES.DELETE_MODAL.DELETE_ERROR_ASSIGNED_SOME');
    } else if (
      modal?.multipleDeleteResponse?.totalUnAuthoCases &&
      modal?.multipleDeleteResponse?.totalUnAuthoCases > 0
    ) {
      return t('EMAIL_TEMPLATES.DELETE_MODAL.DELETE_ERROR_UNAUTHORIZED_SOME');
    } else {
      return t('EMAIL_TEMPLATES.DELETE_MODAL.DELETE_ERROR_ALL');
    }
  }
});

function onCloseModal() {
  emits('refresh');
  emits('close');
}
</script>
<style lang="less">
.delete-mail-configurations-fail-card {
  .ant-card-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: none;
  }

  &__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 24px;
    padding: 0 36px;

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
      margin-top: 8px;
      display: block;
    }
  }

  &__icon {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ffa940;
    width: 68px;
    height: 68px;
    background: #fff6ec;
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
    min-width: 280px;

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
