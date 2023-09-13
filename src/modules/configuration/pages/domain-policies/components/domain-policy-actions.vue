<template>
  <div class="domain-policies-actions">
    <a-button v-if="isShowCreate" type="primary" @click="emits('create')">
      <template #icon>
        <PlusCircleOutlined />
      </template>
      {{ $t('GENERAL.CREATE') }}
    </a-button>
    <div v-else-if="allowMutipleDelete" class="domain-policies-actions__sub-action">
      <a-button type="default" outline class="ls-button__delete" @click="onDeleteDomainPolicies">
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
import { storeToRefs } from 'pinia';
import { PlusCircleOutlined, DeleteFilled } from '@ant-design/icons-vue';
import useDomainPolicies from '@/modules/configuration/pages/domain-policies/hooks/useDomainPolicies';
import { DomainPolicy } from '../types/DomainPolicy';
import { useAuthStore } from '@/modules/auth/store';
import { ACCOUNT_ROLE } from '@/modules/user/types/User';

const authStore = useAuthStore();
const { loggedUser } = storeToRefs(authStore);

// computed
const isSuperAdmin = computed(() => {
  return loggedUser.value?.role === ACCOUNT_ROLE.SUPERADMIN;
});

// props & emits
const emits = defineEmits(['create']);
// composables
const { selectedDomainPolicies, onDeleteDomainPolicies } = useDomainPolicies();

// computed
const isShowCreate = computed(() => {
  return selectedDomainPolicies?.value?.length == 0;
});

const allowMutipleDelete = computed(() => {
  return selectedDomainPolicies.value?.every((record) => {
    return allowDelete(record);
  });
});
// methods

function allowDelete(record: DomainPolicy) {
  return isSuperAdmin.value;
}
</script>
<style lang="less">
.domain-policies-actions {
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
