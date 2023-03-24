<template>
  <div>
    <div>
      <a-alert closable>
        <template #description>
          <ul>
            <li>{{ $t('MIME_POLICIES.CREATE_DESCRIPTION') }}</li>
            <li>{{ $t('MIME_POLICIES.FILTER_DESCRIPTION') }}</li>
            <li>{{ $t('MIME_POLICIES.ENABLED_DESCRIPTION') }}</li>
            <li
              v-html="
                $t('MIME_POLICIES.MANAGE_DESCRIPTION', {
                  domain_link: `${$t('MIME_POLICIES.MANAGE_DOMAIN')}`,
                  url: `${domainLink}/configuration/${currentDomain.uuid}/detail`,
                })
              "
            ></li>
          </ul>
        </template>
      </a-alert>
    </div>
    <div class="actions">
      <a-input v-model:value="filterText" :placeholder="$t('MIME_POLICIES.SEARCH_BY')" class="searchbox" allow-clear>
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input>
      <a-button type="primary" @click="toggleModal()">
        <template #icon>
          <PlusCircleOutlined />
        </template>
        {{ $t('GENERAL.CREATE') }}
      </a-button>
    </div>
  </div>
  <MimesTable></MimesTable>
  <ThePagination v-model="pagination" class="pagination" :is-visible="!!filteredList.length" />
  <CreationModal
    :visible="setCreationModal.opened"
    @close="toggleModal()"
    @refresh="onFetchMimePolicies()"
  ></CreationModal>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';
import { PlusCircleOutlined, SearchOutlined } from '@ant-design/icons-vue';
import MimesTable from '../components/mime-policies-table.vue';
import useMimesPolicies from '../hooks/useMimePolicies';
import ThePagination from '@/core/components/the-pagination.vue';
import CreationModal from '../components/mime-policies-creation-modal.vue';
import { storeToRefs } from 'pinia';
import { useDomainStore } from '@/modules/domain/store';

const { filterText, pagination, filteredList, getMinePoliciesList } = useMimesPolicies();
const domainLink = window.location.origin;
const domainStore = useDomainStore();
const { currentDomain } = storeToRefs(domainStore);
const setCreationModal = reactive({
  opened: false,
});

function toggleModal() {
  setCreationModal.opened = !setCreationModal.opened;
}

async function onFetchMimePolicies() {
  await getMinePoliciesList(currentDomain.value.uuid);
}
</script>

<style lang="less" scoped>
.actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  margin-top: 20px;
}
.actions > .searchbox {
  width: 500px;
  margin-right: 10px;
}
</style>
