<template>
  <div class="domain-policies-page">
    <div class="domain-policies-page__action">
      <a-input
        v-model:value="filterText"
        :placeholder="$t('GENERAL.SEARCH_BY')"
        class="domain-policies-page__action-input"
        allow-clear
      >
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input>
      <domain-policy-actions @create="onCreateDomainPolicy"></domain-policy-actions>
    </div>
    <domain-policy-table></domain-policy-table>
    <ThePagination v-model="pagination" class="pagination" :is-visible="!!filteredList.length" />
  </div>
  <a-modal
    v-model:visible="modal.visible"
    :closable="false"
    :footer="null"
    :destroy-on-close="true"
    wrap-class-name="domain-policies-page__modal"
  >
    <creation-domain-policy-modal
      v-if="modal.type === 'CREATE_DOMAIN_POLICY'"
      @close="onCloseModal"
      @refresh="onFetchDomainPolicy"
    ></creation-domain-policy-modal>
    <delete-domain-policy-card
      v-if="modal.type === 'DELETE_DOMAIN_POLICY'"
      @close="onCloseModal"
      @refresh="onFetchDomainPolicy"
    ></delete-domain-policy-card>
  </a-modal>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { watch } from 'vue';
import DomainPolicyTable from '../components/domain-policy-table.vue';
import ThePagination from '@/core/components/the-pagination.vue';
import { useDomainStore } from '@/modules/domain/store';
import { SearchOutlined } from '@ant-design/icons-vue';
import useDomainPolicies from '../hooks/useDomainPolicies';
import DomainPolicyActions from '../components/domain-policy-actions.vue';
import CreationDomainPolicyModal from '../components/creation-domain-policy-modal.vue';
import DeleteDomainPolicyCard from '../components/delete-domain-policy-card.vue';
const {
  modal,
  list,
  filterText,
  pagination,
  filteredList,
  onCloseModal,
  fetchDomainPolicy,
  onCreateDomainPolicy,
  resetSelectDomainPolicy,
} = useDomainPolicies();
const route = useRoute();
const domainStore = useDomainStore();

async function onFetchDomainPolicy() {
  await fetchDomainPolicy(false);
  resetSelectDomainPolicy();
}

function assignReload() {
  domainStore.fetchDomain();
  fetchDomainPolicy();
}

onFetchDomainPolicy();

watch(route, (newRoute) => {
  if (newRoute) {
    onFetchDomainPolicy();
  }
});
</script>

<style lang="less">
.domain-policies-page {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 16px;

  &__help-text {
    padding: 12px 24px 12px 16px;
    gap: 6px;
    background: #f2f8ff;
    border-radius: 8px;
    border: none;

    ul {
      list-style: none;
    }

    ul li::before {
      content: '\2022';
      color: #007aff;
      font-weight: bold;
      display: inline-block;
      width: 1em;
      margin-left: -1em;
    }
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
