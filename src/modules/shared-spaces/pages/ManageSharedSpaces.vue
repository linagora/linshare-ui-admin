<template>
  <PageTitle
    :title="$t('SHARED_SPACES.MANAGE_SHARED_SPACES.TITLE')"
    :breadcrumbs="breadcrumbs"
  >
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
  />
  <SharedSpacesList />
</template>

<script lang="ts" setup>
import { computed, shallowRef } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import TokenInput, { TokenSubmitPayload } from '@/core/components/TokenInput.vue';
import PageTitle from '@/core/components/PageTitle.vue';
import AccountAutocompleteItem from '@/modules/user/components/AccountAutocompleteItem.vue';
import SharedSpacesList from '@/modules/shared-spaces/components/SharedSpacesList.vue';
import useBreadcrumbs from '@/core/hooks/useBreadcrumbs';
import useSharedSpacesList from '@/modules/shared-spaces/hooks/useSharedSpacesList';
import { listUsers } from '@/modules/user/services/user-api';
import Domain from '@/modules/domain/types/Domain';

const { locale, t } = useI18n();
const { breadcrumbs } = useBreadcrumbs();
const { updateSharedSpacesList } = useSharedSpacesList();
const store = useStore();
const domainsList = store.getters['Domain/getDomainsList'];

const searchForAccounts = async function (mail: string) {
  const data = await listUsers({ mail });

  return data.data.map(user => ({
    label: user.mail,
    value: user.uuid,
    data: user,
    optionComponent: shallowRef(AccountAutocompleteItem)
  }));
};

const sortOptions = [
  {
    key: 'creationDate',
    label: 'SHARED_SPACES.TOKEN_INPUT.CREATION_DATE'
  },
  {
    key: 'modificationDate',
    label: 'SHARED_SPACES.TOKEN_INPUT.MODIFICATION_DATE',
    default: true
  }
];

const filterOptions = [
  {
    key: 'name',
    displayKey: computed(() => t('GENERAL.SEARCH_BY_NAME', locale.value)),
    default: true
  },
  {
    key: 'account',
    displayKey: computed(() => t('SHARED_SPACES.TOKEN_INPUT.ACCOUNT', locale.value)),
    asyncAutocomplete: searchForAccounts
  },
  {
    key: 'nodeType',
    displayKey: computed(() => t('SHARED_SPACES.TOKEN_INPUT.TYPE', locale.value)),
    options: [{
      label: computed(() => t('SHARED_SPACES.NODE_TYPE.WORK_GROUP', locale.value)),
      value: 'WORK_GROUP'
    },
    {
      label: computed(() => t('SHARED_SPACES.NODE_TYPE.WORK_SPACE', locale.value)),
      value: 'WORK_SPACE'
    }]
  },
  {
    key: 'domains',
    displayKey: computed(() => t('GENERAL.DOMAIN', locale.value)),
    options: domainsList.map((domain: Domain) => ({
      label: domain.name,
      value: domain.uuid
    }))
  }
];

const handleSubmit = async function (options: TokenSubmitPayload) {
  let sortObject = {};

  if (options.sort) {
    sortObject = {
      sortField: options.sort.field,
      sortOrder: options.sort.order
    };
  }
  await updateSharedSpacesList({
    ...(options.filters || {}),
    ...(sortObject)
  });
};
</script>
