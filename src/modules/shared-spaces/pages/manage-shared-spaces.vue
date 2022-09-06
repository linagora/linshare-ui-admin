<template>
  <PageTitle :title="$t('SHARED_SPACES.MANAGE_SHARED_SPACES.TITLE')" :breadcrumbs="breadcrumbs">
    <template #helperContent>
      <div>{{ $t('SHARED_SPACES.MANAGE_SHARED_SPACES.TITLE') }}</div>
      <div>{{ $t('SHARED_SPACES.MANAGE_SHARED_SPACES.DESCRIPTION') }}</div>
    </template>
  </PageTitle>

  <TokenInput
    :filters="filterOptions"
    :sorts="sortOptions"
    :placeholder="$t('SHARED_SPACES.TOKEN_INPUT.PLACEHOLDER')"
    @submit="handleSubmit"
    @unmount="reset"
  />
  <div class="list">
    <SharedSpacesList />
  </div>
  <ThePagination
    v-model="pagination"
    class="shared-spaces-list__pagination"
    :is-visible="!!list.length"
    @change="() => handleTableChange()"
  />
</template>

<script lang="ts" setup>
import { computed, shallowRef } from 'vue';
import { useDomainStore } from '@/modules/domain/store';
import { useI18n } from 'vue-i18n';
import TokenInput, { TokenSubmitPayload } from '@/core/components/token-input.vue';
import PageTitle from '@/core/components/page-title.vue';
import AccountAutocompleteItem from '@/modules/user/components/account-autocomplete-item.vue';
import SharedSpacesList from '@/modules/shared-spaces/components/shared-spaces-list.vue';
import ThePagination from '@/core/components/the-pagination.vue';
import useBreadcrumbs from '@/core/hooks/useBreadcrumbs';
import useSharedSpacesList from '@/modules/shared-spaces/hooks/useSharedSpacesList';
import { listUsers } from '@/modules/user/services/user-api';
import Domain from '@/modules/domain/types/Domain';
import { SharedSpaceListFilters } from '@/modules/shared-spaces/types/ShareSpaceList';
import { storeToRefs } from 'pinia';

const { locale, t } = useI18n();
const { breadcrumbs } = useBreadcrumbs();
const { handleTableChange, reset, filters, sorter, pagination, list } = useSharedSpacesList();
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
    key: 'account',
    displayKey: computed(() => t('SHARED_SPACES.TOKEN_INPUT.ACCOUNT', locale.value)),
    asyncAutocomplete: searchForAccounts,
  },
  {
    key: 'nodeType',
    displayKey: computed(() => t('SHARED_SPACES.TOKEN_INPUT.TYPE', locale.value)),
    options: [
      {
        label: computed(() => t('SHARED_SPACES.NODE_TYPE.WORK_GROUP', locale.value)),
        value: 'WORK_GROUP',
      },
      {
        label: computed(() => t('SHARED_SPACES.NODE_TYPE.WORK_SPACE', locale.value)),
        value: 'WORK_SPACE',
      },
    ],
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

const handleSubmit = async function (options: TokenSubmitPayload<SharedSpaceListFilters>) {
  if (options.sort) {
    Object.assign(sorter, options.sort);
  }
  filters.value = options.filters;

  await handleTableChange();
};
</script>

<style lang="less">
.list {
  margin-top: 20px;
}
</style>
