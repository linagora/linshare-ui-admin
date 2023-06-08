<template>
  <PageTitle>
    <template #helperContent>
      <div>{{ $t('INCONSISTENT_USERS.DESCRIPTION') }}</div>
    </template>
  </PageTitle>

  <TokenInput
    :filters="filterOptions"
    :placeholder="$t('INCONSISTENT_USERS.TOKEN_INPUT_PLACEHOLDER')"
    @submit="handleSubmit"
    @reset="reset"
  />
  <div class="list">
    <InconsistentUsersList />
  </div>
  <ThePagination v-model="pagination" class="inconsistent-users-list__pagination" :is-visible="!!list.length" />
</template>

<script lang="ts" setup>
import { computed, shallowRef } from 'vue';
import { useDomainStore } from '@/modules/domain/store';
import { useI18n } from 'vue-i18n';
import TokenInput, { TokenSubmitPayload } from '@/core/components/token-input.vue';
import PageTitle from '@/core/components/page-title.vue';
import AccountAutocompleteItem from '@/modules/user/components/account-autocomplete-item.vue';
import InconsistentUsersList from '@/modules/inconsistent-users/components/inconsistent-users-list.vue';
import ThePagination from '@/core/components/the-pagination.vue';
import useInconsistentUsers from '@/modules/inconsistent-users/hooks/useInconsistentUsers';
import { listUsers } from '@/modules/user/services/user-api';
import Domain from '@/modules/domain/types/Domain';
import { storeToRefs } from 'pinia';
import { InconsistentUsersListFilters } from '../types/InconsistentUsers';

const { locale, t } = useI18n();
const { pagination, list, sorter, filters, handleTableChange, reset, filterText } = useInconsistentUsers();
const domainStore = useDomainStore();
const { getDomainsList: domainsList } = storeToRefs(domainStore);

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

const searchFirstName = async function (mail: string) {
  const data = await listUsers({ mail });

  return data.data.map((user) => ({
    label: user.firstName,
    value: user.firstName,
    key: user.uuid,
    data: user,
    optionComponent: shallowRef(AccountAutocompleteItem),
  }));
};

const searchLastName = async function (mail: string) {
  const data = await listUsers({ mail });

  return data.data.map((user) => ({
    label: user.lastName,
    value: user.lastName,
    key: user.uuid,
    data: user,
    optionComponent: shallowRef(AccountAutocompleteItem),
  }));
};

const filterOptions = [
  {
    key: 'lastName',
    displayKey: computed(() => t('INCONSISTENT_USERS.COLUMNS.LASTNAME', locale.value)),
    asyncAutocomplete: searchLastName,
    default: true,
  },
  {
    key: 'firstName',
    displayKey: computed(() => t('INCONSISTENT_USERS.COLUMNS.FIRSTNAME', locale.value)),
    asyncAutocomplete: searchFirstName,
  },
  {
    key: 'email',
    displayKey: computed(() => t('INCONSISTENT_USERS.COLUMNS.EMAIL', locale.value)),
    asyncAutocomplete: searchForAccounts,
  },
  {
    key: 'domains',
    displayKey: computed(() => t('GENERAL.DOMAIN', locale.value)),
    options: domainsList.value.map((domain: Domain) => ({
      label: domain.name,
      value: domain.uuid,
    })),
  },
];

const handleSubmit = async function (options: TokenSubmitPayload<InconsistentUsersListFilters>) {
  if (options.sort) {
    Object.assign(sorter, options.sort);
  }
  filters.value = options.filters;
  filterText.domain = filters.value.domains;
  filterText.lastName = filters.value.lastName;
  filterText.firstName = filters.value.firstName;
  filterText.mail = filters.value.email;

  await handleTableChange();
};
</script>

<style lang="less">
.list {
  margin-top: 20px;
}
</style>
