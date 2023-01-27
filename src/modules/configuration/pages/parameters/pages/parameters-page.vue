<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { message } from 'ant-design-vue';
import { RightOutlined, SearchOutlined } from '@ant-design/icons-vue';
import { STATUS } from '@/core/types/Status';
import { Functionality } from '../types/Functionality';
import { APIError } from '@/core/types/APIError';
import { useDomainStore } from '@/modules/domain/store';
import { getFunctionalties } from '../services/parameters-api';

interface ListParams {
  filterText: string;
  sorterKey: 'enableFirst' | 'disableFirst' | 'nameAsc' | 'nameDesc';
}

interface FunctionalitySorters {
  [key: string]: (a: Functionality, b: Functionality) => number;
}

const domainStore = useDomainStore();
const { t } = useI18n();
const { currentDomain } = storeToRefs(domainStore);
const mainFunctionalities = ref<Functionality[]>([]);
const status = ref<STATUS>(STATUS.LOADING);
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
  nameAsc: (a: Functionality, b: Functionality) => {
    const translatedNameA = t(`FUNCTIONALITIES.DETAILS.${a.identifier}.NAME`);
    const translatedNameB = t(`FUNCTIONALITIES.DETAILS.${b.identifier}.NAME`);

    return translatedNameA.localeCompare(translatedNameB);
  },
  nameDesc: (a: Functionality, b: Functionality) => {
    const translatedNameA = t(`FUNCTIONALITIES.DETAILS.${a.identifier}.NAME`);
    const translatedNameB = t(`FUNCTIONALITIES.DETAILS.${b.identifier}.NAME`);

    return translatedNameB.localeCompare(translatedNameA);
  },
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

async function fetchFunctionalities() {
  try {
    status.value = STATUS.LOADING;
    mainFunctionalities.value = await getFunctionalties(currentDomain.value.uuid, { includeSubs: false });
    status.value = STATUS.SUCCESS;
  } catch (error) {
    status.value = STATUS.ERROR;

    if (error instanceof APIError) {
      message.error(error.getMessage());
    }
  }
}

watch(
  () => currentDomain.value.uuid,
  (domainUuid) => {
    if (domainUuid) fetchFunctionalities();
  }
);

onMounted(fetchFunctionalities);
</script>

<template>
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
      <a-select-option value="nameAsc">{{ $t('FUNCTIONALITIES.LIST.SORTER.NAME_ASC') }}</a-select-option>
      <a-select-option value="nameDesc">{{ $t('FUNCTIONALITIES.LIST.SORTER.NAME_DESC') }}</a-select-option>
    </a-select>
  </div>

  <a-table
    :pagination="false"
    :show-header="false"
    :columns="columns"
    :data-source="filteredList"
    :loading="status === STATUS.LOADING"
    row-key="identifier"
  >
    <template #bodyCell="{ column, record, text }">
      <template v-if="column.key === 'name'">
        <router-link :to="{ name: 'DomainFunctionality', params: { identifier: record.identifier } }">
          <div class="name">
            <span>{{ t(`FUNCTIONALITIES.DETAILS.${text}.NAME`) }}</span>
          </div>
        </router-link>
      </template>

      <template v-else-if="column.key === 'enable'">
        <a-tag :color="text ? 'success' : 'error'">{{ $t(text ? 'GENERAL.ENABLED' : 'GENERAL.DISABLED') }}</a-tag>
      </template>

      <template v-else-if="column.key === 'action'">
        <router-link :to="{ name: 'DomainFunctionality', params: { identifier: record.identifier } }">
          <RightOutlined />
        </router-link>
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
  color: @text-color;
}
</style>
