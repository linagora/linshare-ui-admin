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
  <div class="list">
    <usersDiagnosticTable></usersDiagnosticTable>
  </div>
  <ThePagination v-model="pagination" class="inconsistent-users-list__pagination" :is-visible="!!list.length" />
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
import useUsersDiagnostic from '../hooks/useUsersDiagnostic';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const { pagination, list, handleTableChange, resetFilters } = useUsersDiagnostic();
const { currentRoute } = useRouter();

const searchForAccounts = async function (mail: string) {
  const data = await listUsers({ mail });

  return data.data.map((user) => ({
    label: user.uuid,
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
  if (!options.filters.email) {
    return;
  }
  await handleTableChange(options.filters.email);
};

watch(currentRoute, (newRoute) => {
  list.value = [];
});
</script>

<style lang="less">
.list {
  margin-top: 20px;
}
</style>
