<template>
  <div class="domain-policy-detail-page">
    <div class="domain-policy-detail-page__title">
      <domain-policy-detail-header
        :editable="allowEdit"
        :editing="editing"
        @edit-toggle="onToggleEditState"
      ></domain-policy-detail-header>
    </div>
    <div class="domain-policy-detail-page__body">
      <div class="domain-policy-detail-page__body-summary">
        <div class="domain-policy-detail-page__body-summary-config">
          <domain-policy-detail-card
            :editable="allowEdit"
            :editing="editing"
            @refresh="onFetchingDomainPolicy"
          ></domain-policy-detail-card>
        </div>
      </div>
    </div>
  </div>
  <div class="domain-policy-detail-page__action">
    <domain-policy-detail-action
      :editable="allowEdit"
      :editing="editing"
      :loading="loading"
      @cancel="onToggleEditState"
      @save="onUpdateDomainPolicy"
      @reset="onResetDomainPolicy"
    ></domain-policy-detail-action>
  </div>
</template>
<script lang="ts" setup>
import DomainPolicyDetailHeader from '@/modules/configuration/pages/domain-policies/components/detail-page/domain-policy-detail-header.vue';
import DomainPolicyDetailAction from '@/modules/configuration/pages/domain-policies/components/detail-page/domain-policy-detail-action.vue';
import DomainPolicyDetailCard from '@/modules/configuration/pages/domain-policies/components/detail-page/domain-policy-detail-card.vue';

import { computed, onMounted, ref } from 'vue';
import useDomainPolicies from '../hooks/useDomainPolicies';
import { DomainPolicy } from '../types/DomainPolicy';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/modules/auth/store';
import { ACCOUNT_ROLE } from '@/modules/user/types/User';

// composables
const {
  loading,
  activeDomainPolicy,
  handleGetDomainPolicyDetail,
  handleUpdateDomainPolicy,
  handleResetDomainPolicy,
  onCheckDefaultDomainPolicy,
} = useDomainPolicies();
const { loggedUserRole } = storeToRefs(useAuthStore());

// data
const editing = ref(false);

//computed

const isSuperAdmin = computed(() => {
  return loggedUserRole.value === ACCOUNT_ROLE.SUPERADMIN;
});
const allowEdit = computed(() => {
  return isSuperAdmin.value || (!onCheckDefaultDomainPolicy(activeDomainPolicy.value) && !hasRootDomain());
});
// methods

function hasRootDomain() {
  return activeDomainPolicy.value.domain === 'LinShareRootDomain';
}

function onToggleEditState() {
  editing.value = !editing.value;
}

async function onUpdateDomainPolicy() {
  const payload: DomainPolicy = {
    ...activeDomainPolicy.value,
  };
  await handleUpdateDomainPolicy(payload);
  onToggleEditState();
}

function onResetDomainPolicy() {
  handleResetDomainPolicy();
}

function onFetchingData() {
  handleGetDomainPolicyDetail(activeDomainPolicy?.value?.uuid);
}

function onFetchingDomainPolicy() {
  handleGetDomainPolicyDetail(activeDomainPolicy?.value?.uuid);
}

onMounted(async () => {
  onFetchingData();
});
</script>

<style lang="less">
.domain-policy-detail-page {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 16px;

  &__help-text {
    padding: 12px 24px 12px 16px;
    gap: 6px;
    background: #f2f8ff;
    border-radius: 8px;
    border: none;

    ul {
      list-style: none;
    }

    ul li::before {
      content: '\2022';
      color: #007aff;
      font-weight: bold;
      display: inline-block;
      width: 1em;
      margin-left: -1em;
    }
  }

  &__title {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
    width: 100%;
  }

  &__modal .ant-modal-content {
    background: #ffffff;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.08), 0px 8px 8px rgba(0, 0, 0, 0.16);
    border-radius: 16px;
    overflow: hidden;
  }

  &__modal .ant-modal-body {
    padding: 0;
  }

  &__body {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }

  &__body-summary {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    gap: 24px;
  }

  &__body-summary-config {
    width: 50%;
  }

  &__body-summary-system {
    width: 50%;
  }

  &__body-table {
    width: 100%;
    margin-top: 20px;
  }

  &__action {
    width: 100%;
  }
}

.ls-detail {
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f2f8ff;
  border: 1px solid #a3dcff;
  color: #007aff;
  border-radius: 7px;
  transform: rotate(90deg);
}
</style>
