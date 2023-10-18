<template>
  <div class="contact-lists-page">
    <a-alert class="contact-lists-page__help-text">
      <template #description>
        {{ $t('CONTACT_LIST.NOTE') }}
      </template>
    </a-alert>
    <TokenInput
      :filters="filterOptions"
      :placeholder="$t('USERS.TOKEN_INPUT.PLACEHOLDER')"
      @submit="handleSubmit"
      @unmount="resetSelectContactList"
    />
    <contact-list-table></contact-list-table>
    <ThePagination v-model="pagination" class="pagination" :is-visible="!!filteredList.length" />
  </div>
</template>

<script lang="ts" setup>
import { watch, shallowRef } from 'vue';
import { useRoute } from 'vue-router';
import useContactList from '../hooks/useContactList';
import { useDomainStore } from '@/modules/domain/store';
import ThePagination from '@/core/components/the-pagination.vue';
import ContactListTable from '../components/contact-list-table.vue';
import { computed } from 'vue';
import { listUsers } from '@/modules/user/services/user-api';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import TokenInput, { TokenSubmitPayload } from '@/core/components/token-input.vue';
import { ContactListFilters } from '../types/Contact';
import AccountAutocompleteItem from '@/modules/user/components/account-autocomplete-item.vue';

const route = useRoute();
const domainStore = useDomainStore();
const { pagination, filteredList, resetSelectContactList, handleTableChange, filters, sorter } = useContactList();
const { locale, t } = useI18n();
const { getDomainsList: domainsList } = storeToRefs(domainStore);

async function onFetchContactList() {
  await handleTableChange();
  resetSelectContactList();
}

const searchForAccountsMail = async function (mail: string) {
  const data = await listUsers({ mail });

  return data.data.map((user) => ({
    label: user.mail,
    value: user.mail,
    data: user,
    optionComponent: shallowRef(AccountAutocompleteItem),
  }));
};

const searchForAccounts = async function (mail: string) {
  const data = await listUsers({ mail });

  return data.data.map((user) => ({
    label: user.mail,
    value: user.uuid,
    data: user,
    optionComponent: shallowRef(AccountAutocompleteItem),
  }));
};

const filterOptions = [
  {
    key: 'domainUuid',
    displayKey: computed(() => t('GENERAL.DOMAIN', locale.value)),
    options: domainsList.value.map((domain) => ({
      label: domain.name,
      value: domain.uuid,
    })),
  },
  {
    key: 'memberMail',
    displayKey: computed(() => t('CONTACT_LIST.MEMBER', locale.value)),
    asyncAutocomplete: searchForAccountsMail,
  },

  {
    key: 'ownerUuid',
    displayKey: computed(() => t('CONTACT_LIST.OWNER_FILTER', locale.value)),
    asyncAutocomplete: searchForAccounts,
    default: true,
  },
];

const handleSubmit = async function (options: TokenSubmitPayload<ContactListFilters>) {
  if (options.sort) {
    Object.assign(sorter, options.sort);
  }
  filters.value = options.filters;

  await handleTableChange();
};

onFetchContactList();

watch(route, (newRoute) => {
  if (newRoute) {
    onFetchContactList();
  }
});
</script>

<style lang="less">
.contact-lists-page {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 16px;

  &__help-text {
    padding: 12px 24px 12px 16px;
    gap: 6px;
    width: 100%;
    background: #f2f8ff;
    border-radius: 8px;
    border: none;
    color: #007aff;
    display: inline-block;
  }

  &__action {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
  }

  &__action-input {
    width: 375px;
  }

  &__action-switch {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    white-space: nowrap;
    gap: 4px;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: -0.02em;
    color: #434657;
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
