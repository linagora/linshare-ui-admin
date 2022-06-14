<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { computed, reactive, ref } from 'vue';
import { useDomainStore } from '@/modules/domain/store';
import { RightOutlined, SearchOutlined } from '@ant-design/icons-vue';
import PageTitle from '@/core/components/PageTitle.vue';
import useBreadcrumbs from '@/core/hooks/useBreadcrumbs';
import StatusValue from '@/core/types/Status';
import { Functionality } from '@/core/types/Functionality';
import useFunctionalities from '../hooks/useFunctionalities';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

interface ListParams {
  filterText: string;
  sorterKey: 'enableFirst' | 'disableFirst';
}

interface FunctionalitySorters {
  [key: string]: (a: Functionality, b: Functionality) => number;
}

const { t } = useI18n();
const domainStore = useDomainStore();
const router = useRouter();
const { breadcrumbs } = useBreadcrumbs();
const { mainFunctionalities, status } = useFunctionalities();

const { currentDomain } = storeToRefs(domainStore);
const params = reactive<ListParams>({
  sorterKey: 'enableFirst',
  filterText: '',
});
const columns = ref([
  {
    dataIndex: ['identifier'],
    key: 'name',
  },
  {
    width: '100px',
    align: 'center',
    dataIndex: ['activationPolicy', 'enable', 'value'],
    key: 'enable',
  },
  {
    width: '80px',
    align: 'center',
    key: 'action',
  },
]);
const sorters: FunctionalitySorters = {
  enableFirst: (a: Functionality, b: Functionality) => {
    if (a.activationPolicy.enable.value) return -1;
    if (b.activationPolicy.enable.value) return 1;

    return 0;
  },
  disableFirst: (a: Functionality, b: Functionality) => {
    if (a.activationPolicy.enable.value) return 1;
    if (b.activationPolicy.enable.value) return -1;

    return 0;
  },
};
const filteredList = computed<Functionality[]>(() => {
  return mainFunctionalities.value
    .filter((functionality) =>
      t(`FUNCTIONALITIES.DETAILS.${functionality.identifier}.NAME`)
        .toLowerCase()
        .includes(params.filterText.toLowerCase())
    )
    .sort(sorters[params.sorterKey]);
});

const customRow = (record: Functionality) => ({
  onClick: () => router.push({ name: 'DomainFunctionality', params: { identifier: record.identifier } }),
});
</script>

<template>
  <PageTitle :title="$t('NAVIGATOR.FUNCTIONALITIES')" :subtitle="currentDomain.name" :breadcrumbs="breadcrumbs" />

  <div class="tools">
    <a-input
      v-model:value="params.filterText"
      :placeholder="$t('FUNCTIONALITIES.LIST.SEARCH_PLACEHOLDER')"
      class="search"
      allow-clear
    >
      <template #prefix>
        <SearchOutlined />
      </template>
    </a-input>
    <a-select v-model:value="params.sorterKey">
      <a-select-option value="enableFirst">{{ $t('FUNCTIONALITIES.LIST.SORTER.ENABLE_FIRST') }}</a-select-option>
      <a-select-option value="disableFirst">{{ $t('FUNCTIONALITIES.LIST.SORTER.DISABLE_FIRST') }}</a-select-option>
    </a-select>
  </div>

  <a-table
    :pagination="false"
    :show-header="false"
    :columns="columns"
    :data-source="filteredList"
    :loading="status === StatusValue.LOADING"
    row-key="identifier"
    :custom-row="customRow"
    class="functionnality-table"
  >
    <template #bodyCell="{ column, record, text }">
      <template v-if="column.key === 'name'">
        <div class="name">
          <span>{{ t(`FUNCTIONALITIES.DETAILS.${record.identifier}.NAME`) }}</span>
        </div>
      </template>

      <template v-else-if="column.key === 'enable'">
        <a-tag :color="text ? 'success' : 'error'">{{ $t(text ? 'GENERAL.ENABLED' : 'GENERAL.DISABLED') }}</a-tag>
      </template>

      <template v-else-if="column.key === 'action'">
        <a>
          <RightOutlined />
        </a>
      </template>
    </template>
  </a-table>
</template>

<style lang="less" scoped>
.tools {
  margin-bottom: 15px;
  padding: 5px;
  display: flex;
  flex-direction: row;

  .search {
    margin-right: 5px;
  }
}

.name {
  width: 100%;
  cursor: pointer;
}

.functionnality-table {
  cursor: pointer;
}
</style>
