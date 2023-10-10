<template>
  <div class="contact-lists-page">
    <a-alert class="contact-lists-page__help-text">
      <template #description>
        {{ $t('CONTACT_LIST.NOTE') }}
      </template>
    </a-alert>
    <div class="contact-lists-page__action">
      <a-input
        v-model:value="filterText"
        :placeholder="$t('GENERAL.SEARCH_BY')"
        class="contact-lists-page__action-input"
        allow-clear
      >
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input>
      <contact-list-actions></contact-list-actions>
    </div>
    <contact-list-table></contact-list-table>
    <ThePagination v-model="pagination" class="pagination" :is-visible="!!filteredList.length" />
  </div>
</template>

<script lang="ts" setup>
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import useContactList from '../hooks/useContactList';
import { SearchOutlined } from '@ant-design/icons-vue';
import { useDomainStore } from '@/modules/domain/store';
import ThePagination from '@/core/components/the-pagination.vue';
import ContactListTable from '../components/contact-list-table.vue';
import ContactListActions from '../components/contact-list-actions.vue';

const route = useRoute();
const domainStore = useDomainStore();
const { filterText, pagination, filteredList, fetchContactList, resetSelectContactList } = useContactList();

async function onFetchContactList() {
  await fetchContactList();
  resetSelectContactList();
}

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
