<template>
  <PageTitle
    :title="$t('NAVIGATOR.USER_FILTERS')"
    :breadcrumbs="breadcrumbs"
  />

  <DomainManagementWarning v-if="!canAccessPage" />

  <div v-else>
    <div class="actions">
      <a-input
        v-model:value="state.filterText"
        :placeholder="$t('GENERAL.SEARCH_BY_NAME')"
        style="width: 200px; margin-right: 10px;"
        allow-clear
      >
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input>

      <a-dropdown :trigger="['click']">
        <a-button
          :disabled="state.loading"
          type="primary"
        >
          <template #icon>
            <PlusCircleOutlined />
          </template>
          {{ $t('GENERAL.CREATE') }}
        </a-button>
        <template #overlay>
          <a-menu>
            <a-menu-item>
              {{ $t('USER_FILTER.TYPES.LDAP') }}
            </a-menu-item>
            <a-menu-item disabled>
              {{ $t('USER_FILTER.TYPES.TWAKE') }}
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>

    <a-table
      :columns="columns"
      :data-source="filteredList"
      :loading="state.loading"
      :locale="{ emptyText: $t('USER_FILTER.EMPTY_TEXT') }"
      row-key="uuid"
    >
      <template #date="{ text }">
        {{ $d(text, 'mediumDate') }}
      </template>

      <template #actions>
        <a-dropdown :trigger="['click']">
          <EllipsisOutlined style="font-size: 16px" />
          <template #overlay>
            <a-menu>
              <a-menu-item>
                {{ $t('GENERAL.EDIT') }}
              </a-menu-item>
              <a-menu-item>
                {{ $t('GENERAL.DUPLICATE') }}
              </a-menu-item>
              <a-menu-item>
                <span class="danger">{{ $t('GENERAL.DELETE') }}</span>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </a-table>
  </div>
</template>

<script lang='ts' setup>
import { computed, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { EllipsisOutlined, SearchOutlined, PlusCircleOutlined } from '@ant-design/icons-vue';
import PageTitle from '@/core/components/PageTitle.vue';
import DomainManagementWarning from '@/modules/domain/components/DomainManagementWarning.vue';

import UserFilter from '../types/UserFilter';
import UserFIlterAPIClient from '../services/UserFilterAPIClient';

import useBreadcrumbs from '@/core/hooks/useBreadcrumbs';
import useDomainConfigurationPages from '@/modules/domain/hooks/useDomainConfigurationPages';

interface UserFiltersListState {
  loading: boolean;
  filterText: string;
  list: UserFilter[];
  target: UserFilter | Record<string, never>;
}

const { t } = useI18n();
const { breadcrumbs } = useBreadcrumbs();
const { canAccessPage } = useDomainConfigurationPages();
const state = reactive<UserFiltersListState>({
  filterText: '',
  loading: true,
  list: [],
  target: {}
});
const filteredList = computed(() =>
  state.list.filter(server => server.name.toLowerCase().includes(state.filterText.toLowerCase()))
);
const columns = computed(() => [
  {
    title: t('GENERAL.NAME'),
    dataIndex: 'name',
    sorter: (a: UserFilter, b: UserFilter) => a.name.localeCompare(b.name)
  },
  {
    title: t('GENERAL.DESCRIPTION'),
    dataIndex: 'description'
  },
  {
    title: t('GENERAL.TYPES'),
    dataIndex: 'type',
    width: '130px',
    sorter: (a: UserFilter, b: UserFilter) => a.type.localeCompare(b.type)
  },
  {
    title: t('GENERAL.CREATION_DATE'),
    dataIndex: 'creationDate',
    sorter: (a: UserFilter, b: UserFilter) => a.creationDate - b.creationDate,
    slots: { customRender: 'date' }
  },
  {
    title: t('GENERAL.MODIFICATION_DATE'),
    dataIndex: 'modificationDate',
    sorter: (a: UserFilter, b: UserFilter) => a.modificationDate - b.modificationDate,
    slots: { customRender: 'date' }
  },
  {
    title: t('GENERAL.ACTIONS'),
    width: '80px',
    align: 'center',
    slots: { customRender: 'actions' }
  }
]);

function fetchUserFilters () {
  if (!canAccessPage.value) {
    return;
  }

  state.loading = true;

  UserFIlterAPIClient.listUserFilters()
    .then(filters => {
      state.list = filters;
    })
    .finally(() => {
      state.loading = false;
    });
}

onMounted(fetchUserFilters);
</script>

<style lang="less" scoped>
  .actions {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
  }

  .danger {
    color: @error-color;
  }
</style>
