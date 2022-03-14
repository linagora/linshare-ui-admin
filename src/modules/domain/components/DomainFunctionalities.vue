<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { message } from 'ant-design-vue';
import { RightOutlined, SearchOutlined } from '@ant-design/icons-vue';
import PageTitle from '@/core/components/PageTitle.vue';
import useBreadcrumbs from '@/core/hooks/useBreadcrumbs';
import StatusValue from '@/core/types/Status';
import { APIError } from '@/core/types/APIError';
import { Functionality } from '@/core/types/Functionality';
import { getFunctionalties } from '../services/domain-api';

interface State {
  functionalities: Functionality[];
  status: StatusValue;
  filterText: string;
  sorterKey: 'enableFirst' | 'disableFirst';
}

interface FunctionalitySorters {
  [key: string]: (a: Functionality, b: Functionality) => number;
}

const { breadcrumbs } = useBreadcrumbs();
const { t } = useI18n();
const store = useStore();
const state = reactive<State>({
  functionalities: [],
  status: StatusValue.LOADING,
  sorterKey: 'enableFirst',
  filterText: '',
});
const currentDomainStatus = computed<StatusValue>(() => store.getters['Domain/getStatus']('currentDomain'));
const currentDomain = computed(() => store.getters['Domain/getCurrentDomain']);
const currentDomainUuid = computed(() => store.getters['Domain/getCurrentDomainUuid']);
const columns = ref([
  {
    dataIndex: 'identifier',
    slots: { customRender: 'name' },
  },
  {
    width: '100px',
    align: 'center',
    dataIndex: 'activationPolicy.enable.value',
    slots: { customRender: 'enable' },
  },
  {
    width: '80px',
    align: 'center',
    slots: { customRender: 'action' },
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
  return state.functionalities
    .filter((functionality) =>
      t(`FUNCTIONALITIES.DETAILS.${functionality.identifier}.NAME`)
        .toLowerCase()
        .includes(state.filterText.toLowerCase())
    )
    .sort(sorters[state.sorterKey]);
});

async function prepareFunctionalities() {
  if (!currentDomainUuid.value) {
    return;
  }

  state.status = StatusValue.LOADING;

  try {
    state.functionalities = await getFunctionalties(currentDomainUuid.value, {
      includeSubs: false,
    });

    state.status = StatusValue.SUCCESS;
  } catch (error) {
    state.status = StatusValue.ERROR;

    if (error instanceof APIError) {
      message.error(error.getMessage());
    }
  }
}

onMounted(prepareFunctionalities);
watch(currentDomainStatus, (domainStatus: StatusValue) => {
  if (domainStatus === StatusValue.LOADING) {
    prepareFunctionalities();
  }
});
</script>

<template>
  <PageTitle :title="$t('NAVIGATOR.FUNCTIONALITIES')" :subtitle="currentDomain.name" :breadcrumbs="breadcrumbs" />

  <div class="tools">
    <a-input
      v-model:value="state.filterText"
      :placeholder="$t('FUNCTIONALITIES.LIST.SEARCH_PLACEHOLDER')"
      class="search"
      allow-clear
    >
      <template #prefix>
        <SearchOutlined />
      </template>
    </a-input>
    <a-select v-model:value="state.sorterKey">
      <a-select-option value="enableFirst">{{ $t('FUNCTIONALITIES.LIST.SORTER.ENABLE_FIRST') }}</a-select-option>
      <a-select-option value="disableFirst">{{ $t('FUNCTIONALITIES.LIST.SORTER.DISABLE_FIRST') }}</a-select-option>
    </a-select>
  </div>

  <a-table
    :pagination="false"
    :show-header="false"
    :columns="columns"
    :data-source="filteredList"
    :loading="state.status === StatusValue.LOADING"
    row-key="identifier"
  >
    <template #name="{ text }">
      {{ t(`FUNCTIONALITIES.DETAILS.${text}.NAME`) }}
    </template>

    <template #enable="{ text }">
      <a-tag :color="text ? 'success' : 'error'">{{ $t(text ? 'GENERAL.ENABLED' : 'GENERAL.DISABLED') }}</a-tag>
    </template>

    <template #action>
      <a>
        <RightOutlined />
      </a>
    </template>
  </a-table>
</template>

<style lang="less" scoped>
.spinner {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tools {
  margin-bottom: 15px;
  padding: 5px;
  display: flex;
  flex-direction: row;

  .search {
    margin-right: 5px;
  }
}
</style>
