<template>
  <a-card flat :bordered="false" class="delete-mime-policies-fail-card">
    <span class="delete-mime-policies-fail-card__icon">
      <warning-icon width="36" height="36"></warning-icon>
    </span>
    <div class="delete-mime-policies-fail-card__content">
      <strong>{{ $t('MIME_POLICIES.DELETE_MODAL.DELETE_FAILURE') }}</strong>
      <span>{{ deleteMessage }}</span>
    </div>
    <div class="delete-mime-policies-fail-card__actions">
      <a-button class="ls-button ls-cancel" type="primary" @click="onCloseModal">{{ $t('GENERAL.OK') }}</a-button>
    </div>
  </a-card>
</template>
<script lang="ts" setup>
import WarningIcon from '@/core/components/icons/warning-icon.vue';
import { computed } from 'vue';
import useMimesPolicies from '../hooks/useMimePolicies';
import { useI18n } from 'vue-i18n';

// composable
const { t } = useI18n();
const { selectedMimePolicies, checkingMimePolicyDomainAuthorized } = useMimesPolicies();
//props & emits
const emits = defineEmits(['close', 'refresh']);

//computed

const totalAssignedMime = computed(() => {
  return selectedMimePolicies.value?.filter((item) => item.assigned)?.length ?? 0;
});
const totalUnAuthorizeDomainMimes = computed(() => {
  return selectedMimePolicies.value?.filter((item) => !checkingMimePolicyDomainAuthorized(item))?.length ?? 0;
});
const totalSelectedMimes = computed(() => {
  return selectedMimePolicies?.value?.length ?? 0;
});
const deleteMessage = computed(() => {
  if (totalSelectedMimes.value === 1) {
    if (totalAssignedMime.value === 1) {
      return t('MIME_POLICIES.DELETE_MODAL.DELETE_SINGLE_FAIL');
    } else if (totalUnAuthorizeDomainMimes.value === 1) {
      return t('MIME_POLICIES.DELETE_MODAL.UNABLE_DELETE_ONE_MIME');
    } else {
      return t('MIME_POLICIES.DELETE_MODAL.UNABLE_DELETE_ONE_MIME');
    }
  } else {
    if (totalAssignedMime.value + totalUnAuthorizeDomainMimes.value === totalSelectedMimes?.value) {
      return t('MIME_POLICIES.DELETE_MODAL.UNABLE_DELETE_ALL_MIME');
    } else if (totalAssignedMime.value > 0) {
      return t('MIME_POLICIES.DELETE_MODAL.DELETE_FAILURE_MESSAGE');
    } else if (totalAssignedMime.value === 0 && totalUnAuthorizeDomainMimes.value > 0) {
      return t('MIME_POLICIES.DELETE_MODAL.UNABLE_DELETE_SOME_MIME');
    } else if (totalUnAuthorizeDomainMimes.value === totalSelectedMimes?.value) {
      return t('MIME_POLICIES.DELETE_MODAL.UNABLE_DELETE_ALL_MIME');
    }
    return t('MIME_POLICIES.DELETE_MODAL.DELETE_FAILURE');
  }
});

function onCloseModal() {
  emits('refresh');
  emits('close');
}
</script>
<style lang="less">
.delete-mime-policies-fail-card {
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
