<template>
  <div class="domain-policy-detail-header">
    <div class="domain-policy-detail-header__title">
      <strong>{{ activeDomainPolicy.label }}</strong>
    </div>
    <div class="domain-policy-detail-header__action">
      <template v-if="!editing">
        <a-button class="ls-button" @click="onBackToDomainPolicies">
          <template #icon>
            <ArrowLeftOutlined />
          </template>
          {{ $t('GENERAL.BACK_TO_LIST') }}
        </a-button>
        <a-button
          v-if="editable && !editing"
          type="primary"
          class="ls-button ls-filled"
          @click="onToggleEditDomainPolicy"
        >
          <template #icon>
            <EditOutlined />
          </template>
          {{ $t('GENERAL.EDIT') }}
        </a-button>
      </template>
      <domain-policy-detail-action
        v-else
        :editable="editable"
        :editing="editing"
        :loading="loading"
        @cancel="onToggleEditDomainPolicy"
        @save="onUpdateDomainPolicy"
        @reset="onResetDomainPolicy"
      ></domain-policy-detail-action>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons-vue';
import { CONFIGURATION_DOMAIN_POLICIES_ROUTE_NAMES } from '@/modules/configuration/pages/domain-policies/router';
import DomainPolicyDetailAction from '@/modules/configuration/pages/domain-policies/components/detail-page/domain-policy-detail-action.vue';
import { DomainPolicy } from '../../types/DomainPolicy';
import useDomainPolicies from '../../hooks/useDomainPolicies';
const router = useRouter();

// props & emits
const props = defineProps<{
  editable?: boolean;
  editing?: boolean;
}>();
const emits = defineEmits(['edit-toggle']);

const {
  loading,
  activeDomainPolicyForm,
  activeDomainPolicy,
  handleUpdateDomainPolicy,
  handleResetDomainPolicy,
  handleGetDomainPolicyDetail,
} = useDomainPolicies();

// methods
function onBackToDomainPolicies() {
  router.push({ name: CONFIGURATION_DOMAIN_POLICIES_ROUTE_NAMES.POLICIES });
}

function onToggleEditDomainPolicy() {
  emits('edit-toggle');
}

async function onUpdateDomainPolicy() {
  const payload: DomainPolicy = {
    ...activeDomainPolicyForm.value,
  };
  await handleUpdateDomainPolicy(payload);
  await handleGetDomainPolicyDetail(activeDomainPolicyForm?.value?.identifier || activeDomainPolicy?.value?.identifier);
  onToggleEditDomainPolicy();
}

function onResetDomainPolicy() {
  handleResetDomainPolicy();
}
</script>
<style lang="less">
.domain-policy-detail-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 28px;
  width: 100%;

  &__title {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    strong {
      font-weight: 600;
      font-size: 17px;
      line-height: 24px;
      color: #1b1d29;
    }

    span {
      font-weight: 400;
      font-size: 13px;
      line-height: 16px;
      color: #989cb1;
    }
  }

  &__action {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;

    .ls-button {
      padding: 0px 20px;
      min-width: 151px;
      height: 44px;
      background: #f3f3f7;
      border-radius: 8px;
      color: #007aff;
    }

    .ls-filled {
      background-color: #007aff;
      color: #f3f3f7;
    }
  }
}
</style>
