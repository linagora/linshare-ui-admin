<template>
  <PageTitle
    :title="$t('SHARED_SPACES.MANAGE_SHARED_SPACES.TITLE')"
    :breadcrumbs="breadcrumbs"
  >
    <template #helperContent>
      <div class='alert-message-in-description'>{{ $t('SHARED_SPACES.MANAGE_SHARED_SPACES.TITLE') }}</div>
      <div>{{ $t('SHARED_SPACES.MANAGE_SHARED_SPACES.DESCRIPTION') }}</div>
    </template>

  </PageTitle>

  <TokenInput
    :filterOptions="filterOptions"
    :sortOptions="sortOptions"
    :placeholder="$t('USERS.TOKEN_INPUT.PLACEHOLDER')"
    @submit="handleSubmit"
  />
  <SharedSpacesList />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import PageTitle from '@/core/components/PageTitle.vue';
import SharedSpacesList from '@/modules/shared-spaces/components/SharedSpacesList.vue';
import useSharedSpacesList from '@/modules/shared-spaces/hooks/useSharedSpacesList';
import TokenInput, { Filter } from '@/core/components/TokenInput.vue';
import UserAPIClient from '@/modules/user/services/UserAPIClient';
import AccountAutocompleteItem from '@/modules/user/components/AccountAutocompleteItem.vue';

interface Options {
  filters: Filter;
  sort: {
    field: string;
    order: string;
  };
}

export default defineComponent({
  name: 'ManageSharedSpaces',
  components: {
    SharedSpacesList,
    PageTitle,
    TokenInput
  },
  setup () {
    const { meta } = useRoute();
    const { locale, t } = useI18n();
    const breadcrumbs = meta && meta.parent && meta.parentName
      ? [{
        key: meta.parent,
        label: meta.parentName
      }] : [];
    const { updateSharedSpacesList } = useSharedSpacesList();

    const searchForAccounts = async function (mail: string) {
      const data = await UserAPIClient.listUsers({ mail });
      return (data && data.data && data.data.map(user => ({
        label: user.mail,
        value: user.uuid,
        optionComponent: AccountAutocompleteItem,
        data: user
      }))) || [];
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
        key: 'account',
        displayKey: computed(() => t('SHARED_SPACES.TOKEN_INPUT.ACCOUNT', locale.value)),
        asyncAutocomplete: searchForAccounts
      },
      {
        key: 'nodeType',
        displayKey: computed(() => t('SHARED_SPACES.TOKEN_INPUT.TYPE', locale.value)),
        options: [
          {
            label: computed(() => t('SHARED_SPACES.NODE_TYPE.WORK_GROUP', locale.value)),
            value: 'WORK_GROUP'
          },
          {
            label: computed(() => t('SHARED_SPACES.NODE_TYPE.DRIVE', locale.value)),
            value: 'DRIVE'
          }
        ]
      }
    ];

    const handleSubmit = async function (options: Options) {
      let sortObject = {};
      if (options.sort) {
        sortObject = {
          sortField: options.sort.field,
          sortOrder: options.sort.order === 'descend' ? 'DESC' : 'ASC'
        };
      }
      await updateSharedSpacesList({
        ...(options.filters || {}),
        ...(sortObject)
      });
    };

    return {
      breadcrumbs,
      sortOptions,
      filterOptions,
      handleSubmit
    };
  }
});
</script>
