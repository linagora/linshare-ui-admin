<template>
  <PageTitle>
    <template #helperContent>
      <div>{{ $t('INCONSISTENT_USERS.DESCRIPTION') }}</div>
    </template>
  </PageTitle>

  <TokenInput
    :filters="filterOptions"
    :sorts="sortOptions"
    :placeholder="$t('INCONSISTENT_USERS.TOKEN_INPUT_PLACEHOLDER')"
    @submit="handleSubmit"
    @unmount="reset"
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
import { SharedSpaceListFilters } from '@/modules/shared-spaces/types/ShareSpaceList';
import { storeToRefs } from 'pinia';

const { locale, t } = useI18n();
const { pagination, list } = useInconsistentUsers();
const domainStore = useDomainStore();
const { getDomainsList: domainsList } = storeToRefs(domainStore);

const searchForAccounts = async function (mail: string) {
  const data = await listUsers({ mail });

  return data.data.map((user) => ({
    label: user.mail,
    value: user.uuid,
    data: user,
    optionComponent: shallowRef(AccountAutocompleteItem),
  }));
};

const sortOptions = [
  {
    key: 'name',
    label: 'SHARED_SPACES.TOKEN_INPUT.NAME',
  },
  {
    key: 'creationDate',
    label: 'SHARED_SPACES.TOKEN_INPUT.CREATION_DATE',
  },
  {
    key: 'modificationDate',
    label: 'SHARED_SPACES.TOKEN_INPUT.MODIFICATION_DATE',
    default: true,
  },
];

const filterOptions = [
  {
    key: 'name',
    displayKey: computed(() => t('GENERAL.SEARCH_BY_NAME', locale.value)),
    default: true,
  },
  {
    key: 'email',
    displayKey: computed(() => t('INCONSISTENT_USERS.COLUMNS.EMAIL', locale.value)),
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

// const handleSubmit = async function (options: TokenSubmitPayload<SharedSpaceListFilters>) {
//   if (options.sort) {
//     Object.assign(sorter, options.sort);
//   }
//   filters.value = options.filters;

//   await handleTableChange();
// };
</script>

<style lang="less">
.list {
  margin-top: 20px;
}
</style>
