<template>
  <PageTitle>
    <template #helperContent>
      <div>{{ $t('INCONSISTENT_USERS.SCRUTINY.DESCRIPTION') }}</div>
    </template>
  </PageTitle>

  <TokenInput
    :filters="filterOptions"
    :placeholder="$t('USERS.MANAGE_USERS.EMAIL')"
    @submit="handleSubmit"
    @reset="resetFilters"
  />
  <div class="diagnotic-elements">
    <div class="list">
      <usersDiagnosticTable></usersDiagnosticTable>
      <ThePagination v-model="pagination" class="inconsistent-users-list__pagination" :is-visible="!!list.length" />
    </div>
    <div v-if="activeUserDiagnostic !== undefined" class="users-diagnostic-detail-block">
      <usersDiagnosticDetail></usersDiagnosticDetail>
    </div>
  </div>
  <a-modal
    v-model:visible="userCreateModal.open"
    :closable="false"
    :footer="null"
    :destroy-on-close="true"
    class="diagnostic-creation-modal"
  >
    <profilCreationModal @close="onCloseModal"></profilCreationModal>
  </a-modal>
</template>

<script lang="ts" setup>
import { computed, shallowRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import TokenInput, { TokenSubmitPayload } from '@/core/components/token-input.vue';
import PageTitle from '@/core/components/page-title.vue';
import AccountAutocompleteItem from '@/modules/user/components/account-autocomplete-item.vue';
import ThePagination from '@/core/components/the-pagination.vue';
import { listUsers } from '@/modules/user/services/user-api';
import { UserDiagnosticFilters } from '../types/UserDiagnotic';
import usersDiagnosticTable from '../components/users-diagnostic-table.vue';
import usersDiagnosticDetail from '../components/users-diagnostic-detail-card.vue';
import useUsersDiagnostic from '../hooks/useUsersDiagnostic';
import { useRouter } from 'vue-router';
import profilCreationModal from '../components/profil-creation-modal.vue';
import User from '@/modules/user/types/User';

const { t } = useI18n();
const { pagination, list, handleTableChange, resetFilters, activeUserDiagnostic, userCreateModal } =
  useUsersDiagnostic();
const { currentRoute } = useRouter();

const searchForAccounts = async function (mail: string) {
  const data = await listUsers({ mail });

  const uniqueEmails = new Set<string>();
  const uniqueUsers: User[] = [];

  data.data.forEach((user) => {
    if (!uniqueEmails.has(user.mail)) {
      uniqueEmails.add(user.mail);
      uniqueUsers.push(user);
    }
  });

  return uniqueUsers.map((user: User) => ({
    label: user.mail,
    value: user.mail,
    key: user.uuid,
    data: user,
    optionComponent: shallowRef(AccountAutocompleteItem),
  }));
};

const filterOptions = [
  {
    key: 'email',
    displayKey: computed(() => t('INCONSISTENT_USERS.COLUMNS.EMAIL')),
    asyncAutocomplete: searchForAccounts,
    default: true,
  },
];

const handleSubmit = async function (options: TokenSubmitPayload<UserDiagnosticFilters>) {
  activeUserDiagnostic.value = undefined;
  if (!options.filters.email) {
    list.value = [];
    return;
  }
  await handleTableChange(options.filters.email);
};

function onCloseModal() {
  userCreateModal.open = false;
}

watch(currentRoute, (newRoute) => {
  list.value = [];
});
</script>

<style lang="less">
.diagnotic-elements {
  display: flex;
  flex-direction: row;
}

.users-diagnostic-detail-block {
  flex: 1;
}
.list {
  margin-top: 20px;
  margin-right: 30px;
  flex: 1;
}

.ant-modal-content {
  background: #ffffff;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.08), 0px 8px 8px rgba(0, 0, 0, 0.16);
  border-radius: 16px;
  overflow: hidden;
}
</style>
