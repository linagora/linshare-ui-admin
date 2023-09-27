<template>
  <a-card flat :bordered="false" class="assign-domain-policy-card">
    <span class="assign-domain-policy-card__icon">
      <AssignIcon width="28" height="28" />
    </span>
    <div class="assign-domain-policy-card__content">
      <strong>{{ $t('DOMAIN_POLICY.ASSIGN_MODAL.TITLE') }}</strong>
      <span>{{ $t('DOMAIN_POLICY.ASSIGN_MODAL.ASSIGN_CONFIRM') }}</span>
    </div>
    <div class="assign-domain-policy-card__actions">
      <a-button class="ls-button ls-cancel" type="primary" @click="onCloseModal">{{ $t('GENERAL.NO') }}</a-button>
      <a-button class="ls-button ls-save" type="primary" info @click="onConfirmAssign">
        <span>{{ $t('GENERAL.YES') }}</span>
      </a-button>
    </div>
  </a-card>
</template>
<script lang="ts" setup>
import AssignIcon from '@/core/components/icons/assign-mime-icon.vue';
import useDomainPolicies from '@/modules/configuration/pages/domain-policies/hooks/useDomainPolicies';

const { handleAssignDomainPolicy } = useDomainPolicies();
import { useDomainStore } from '@/modules/domain/store';
import { storeToRefs } from 'pinia';

const domainStore = useDomainStore();
const { currentDomain } = storeToRefs(domainStore);

const emits = defineEmits(['close', 'refresh']);

function onCloseModal() {
  emits('close');
}
async function onConfirmAssign() {
  await handleAssignDomainPolicy(currentDomain.value);
  emits('refresh');
  emits('close');
}
</script>
<style lang="less">
.assign-domain-policy-card {
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
    color: #007aff;
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
