<template>
  <PageTitle
    :title="$t('NAVIGATOR.GROUP_FILTERS')"
    :breadcrumbs="breadcrumbs"
  />

  <div>
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

      <router-link :to="{ name: 'GroupFilterLDAP' }">
        <a-button
          :disabled="state.loading"
          type="primary"
        >
          <template #icon>
            <PlusCircleOutlined />
          </template>
          {{ $t('GENERAL.CREATE') }}
        </a-button>
      </router-link>
    </div>

    <a-table
      :columns="columns"
      :data-source="filteredList"
      :loading="state.loading"
      :locale="{ emptyText: $t('GROUP_FILTER.EMPTY_TEXT') }"
      row-key="uuid"
    >
      <template #name="{ record, text }">
        <a @click="viewDetails(record)">{{ text }}</a>
      </template>

      <template #date="{ text }">
        {{ $d(text, 'mediumDate') }}
      </template>

      <template #actions="{ record }">
        <a-dropdown :trigger="['click']">
          <EllipsisOutlined style="font-size: 16px" />
          <template #overlay>
            <a-menu>
              <a-menu-item @click="viewDetails(record)">
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
    </a-table>
  </div>
</template>

<script lang='ts' setup>
import { computed, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';

import {
  EllipsisOutlined,
  SearchOutlined,
  PlusCircleOutlined
} from '@ant-design/icons-vue';
import PageTitle from '@/core/components/PageTitle.vue';

import { LDAPGroupFilter } from '../types/GroupFilters';
import { deleteGroupFilter, getGroupFilterAssociatedDomains, listGroupFilters } from '../services/group-filter-api';

import useBreadcrumbs from '@/core/hooks/useBreadcrumbs';
import { APIError } from '@/core/types/APIError';
import useNotification from '@/core/hooks/useNotification';

interface GroupFiltersListState {
  loading: boolean;
  filterText: string;
  list: LDAPGroupFilter[];
  target: LDAPGroupFilter | Record<string, never>;
}

const router = useRouter();
const { t } = useI18n();
const { breadcrumbs } = useBreadcrumbs();
const { infoModal, confirmModal } = useNotification();
const state = reactive<GroupFiltersListState>({
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
    sorter: (a: LDAPGroupFilter, b: LDAPGroupFilter) => a.name.localeCompare(b.name),
    slots: { customRender: 'name' }
  },
  {
    title: t('GENERAL.DESCRIPTION'),
    dataIndex: 'description'
  },
  {
    title: t('GENERAL.TYPES'),
    dataIndex: 'type',
    width: '130px',
    sorter: (a: LDAPGroupFilter, b: LDAPGroupFilter) => a.type.localeCompare(b.type)
  },
  {
    title: t('GENERAL.CREATION_DATE'),
    dataIndex: 'creationDate',
    sorter: (a: LDAPGroupFilter, b: LDAPGroupFilter) => (a.creationDate || 0) - (b.creationDate || 0),
    slots: { customRender: 'date' }
  },
  {
    title: t('GENERAL.MODIFICATION_DATE'),
    dataIndex: 'modificationDate',
    sorter: (a: LDAPGroupFilter, b: LDAPGroupFilter) => (a.creationDate || 0) - (b.creationDate || 0),
    defaultSortOrder: 'descend',
    slots: { customRender: 'date' }
  },
  {
    title: t('GENERAL.ACTIONS'),
    width: '80px',
    align: 'center',
    slots: { customRender: 'actions' }
  }
]);

function fetchGroupFilters () {
  state.loading = true;

  listGroupFilters()
    .then(filters => {
      state.list = filters;
    })
    .catch(error => {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      } else {
        console.error(error);
      }
    })
    .finally(() => {
      state.loading = false;
    });
}

function viewDetails (filter: LDAPGroupFilter) {
  router.push({
    name: 'GroupFilterLDAP',
    params: {
      uuid: filter.uuid
    }
  });
}

function duplicate (filter: LDAPGroupFilter) {
  router.push({
    name: 'GroupFilterLDAP',
    params: {
      uuid: filter.uuid,
      duplicate: 'true'
    }
  });
}

async function confirmDelete (filter: LDAPGroupFilter) {
  const usedInDomains = !!(await getGroupFilterAssociatedDomains(filter.uuid)).length;

  if (usedInDomains) {
    return infoModal({
      title: t('GENERAL.DELETION'),
      content: t('GROUP_FILTER.DELETE_ABORT')
    });
  }

  confirmModal({
    title: t('GENERAL.DELETION'),
    content: t('GROUP_FILTER.DELETE_CONFIRM'),
    okText: t('GENERAL.DELETE'),
    onOk: () => deleteGroupFilter(filter.uuid)
      .then(() => {
        message.success(t('MESSAGES.DELETE_SUCCESS'));
        state.list = state.list.filter(item => !(item.uuid === filter.uuid));
      })
      .catch(() => {
        message.error(t('MESSAGES.DELETE_FAILURE'));
      })
  });
}

onMounted(fetchGroupFilters);
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
