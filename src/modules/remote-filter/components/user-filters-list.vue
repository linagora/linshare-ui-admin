<template>
  <PageTitle :title="$t('NAVIGATOR.USER_FILTERS')" :breadcrumbs="breadcrumbs" />

  <div>
    <div class="actions">
      <a-input
        v-model:value="state.filterText"
        :placeholder="$t('GENERAL.SEARCH_BY_NAME')"
        style="width: 200px; margin-right: 10px"
        allow-clear
      >
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input>

      <a-dropdown :trigger="['click']">
        <a-button :disabled="state.loading" type="primary">
          <template #icon>
            <PlusCircleOutlined />
          </template>
          {{ $t('GENERAL.CREATE') }}
        </a-button>
        <template #overlay>
          <a-menu>
            <a-menu-item>
              <router-link :to="{ name: 'UserFilterLDAP' }">
                {{ $t('USER_FILTER.TYPES.LDAP') }}
              </router-link>
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
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.key === 'name'">
          <a @click="edit(record)">{{ text }}</a>
        </template>

        <template v-else-if="column.key === 'date'">
          {{ $d(text, 'mediumDate') }}
        </template>

        <template v-else-if="column.key === 'actions'">
          <a-dropdown :trigger="['click']">
            <EllipsisOutlined style="font-size: 16px" />
            <template #overlay>
              <a-menu>
                <a-menu-item @click="edit(record)">
                  {{ $t('GENERAL.EDIT') }}
                </a-menu-item>
                <a-menu-item @click="duplicate(record)">
                  {{ $t('GENERAL.DUPLICATE') }}
                </a-menu-item>
                <a-menu-item @click="confirmDelete(record)">
                  <span class="danger">{{ $t('GENERAL.DELETE') }}</span>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';

import { EllipsisOutlined, SearchOutlined, PlusCircleOutlined } from '@ant-design/icons-vue';
import PageTitle from '@/core/components/page-title.vue';

import UserFilter, { USER_FILTER_TYPE } from '../types/UserFilter';
import { deleteUserFilter, getAssociatedDomains, listUserFilters } from '../services/user-filter-api';

import useBreadcrumbs from '@/core/hooks/useBreadcrumbs';
import useNotification from '@/core/hooks/useNotification';
import type { TableColumnsType } from 'ant-design-vue';

interface UserFiltersListState {
  loading: boolean;
  filterText: string;
  list: UserFilter[];
  target: UserFilter | Record<string, never>;
}

const { t } = useI18n();
const { push } = useRouter();
const { breadcrumbs } = useBreadcrumbs();
const { infoModal, confirmModal } = useNotification();
const state = reactive<UserFiltersListState>({
  filterText: '',
  loading: true,
  list: [],
  target: {},
});
const filteredList = computed(() =>
  state.list.filter((server) => server.name.toLowerCase().includes(state.filterText.toLowerCase()))
);
const columns = computed(() => [
  {
    title: t('GENERAL.NAME'),
    dataIndex: ['name'],
    key: 'name',
    sorter: (a: UserFilter, b: UserFilter) => a.name.localeCompare(b.name),
  },
  {
    title: t('GENERAL.DESCRIPTION'),
    dataIndex: ['description'],
    key: 'description',
  },
  {
    title: t('GENERAL.TYPES'),
    dataIndex: ['type'],
    key: 'type',
    width: '130px',
    sorter: (a: UserFilter, b: UserFilter) => a.type.localeCompare(b.type),
  },
  {
    title: t('GENERAL.CREATION_DATE'),
    dataIndex: ['creationDate'],
    key: 'date',
    sorter: (a: UserFilter, b: UserFilter) => a.creationDate - b.creationDate,
  },
  {
    title: t('GENERAL.MODIFICATION_DATE'),
    dataIndex: ['modificationDate'],
    sorter: (a: UserFilter, b: UserFilter) => a.modificationDate - b.modificationDate,
    defaultSortOrder: 'descend',
    key: 'date',
  },
  {
    title: t('GENERAL.ACTIONS'),
    width: '80px',
    align: 'center',
    key: 'actions',
  },
]);

function fetchUserFilters() {
  state.loading = true;

  listUserFilters()
    .then((filters) => {
      state.list = filters;
    })
    .finally(() => {
      state.loading = false;
    });
}

function edit(filter: UserFilter) {
  if (filter.type === USER_FILTER_TYPE.LDAP) {
    push({ name: 'UserFilterLDAP', params: { uuid: filter.uuid } });
  }
}

async function confirmDelete(filter: UserFilter) {
  const usedInDomains = !!(await getAssociatedDomains(filter.uuid)).length;

  if (usedInDomains) {
    return infoModal({
      title: t('GENERAL.DELETION'),
      content: t('USER_FILTER.DELETE_ABORT'),
    });
  }

  confirmModal({
    title: t('GENERAL.DELETION'),
    content: t('USER_FILTER.DELETE_CONFIRM'),
    okText: t('GENERAL.DELETE'),
    onOk: () => removeUserFilter(filter),
  });
}

async function removeUserFilter(filter: UserFilter) {
  try {
    await deleteUserFilter(filter.uuid);

    message.success(t('MESSAGES.DELETE_SUCCESS'));
    state.list = state.list.filter((item) => !(item.uuid === filter.uuid));
  } catch (error) {
    message.error(t('MESSAGES.DELETE_FAILURE'));
  }
}

function duplicate(filter: UserFilter) {
  if (filter.type === USER_FILTER_TYPE.LDAP) {
    push({ name: 'UserFilterLDAP', params: { uuid: filter.uuid, duplicate: 'true' } });
  }
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
