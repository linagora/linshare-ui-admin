<template>
  <div class="email-layout-table">
    <a-table
      key="uuid"
      class="email-layout-table__table"
      :data-source="mimeTypesByPage"
      :pagination="false"
      :loading="status === STATUS.LOADING"
      :row-selection="rowSelection"
      row-key="uuid"
      :columns="columns"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'description'">
          {{ record.description }}
        </template>
        <template v-if="column.key === 'readonly'">
          <a-tag v-if="record.readonly" color="red">
            {{ $t('EMAIL_TEMPLATES.READ_ONLY') }}
          </a-tag>
          <a-tag v-else color="success"> {{ $t('EMAIL_TEMPLATES.EDITABLE') }}</a-tag>
        </template>
        <template v-if="column.key === 'domain'">
          <span v-if="!checkingEmailLayoutsDomainAuthorized(record.domain)">{{ record.domainName }}</span>
          <router-link
            v-else-if="status === STATUS.SUCCESS"
            :to="{ name: 'ConfigurationDomainDetail', params: { domainUuid: record.domain } }"
          >
            <span>{{ record.domainName }}</span>
          </router-link>
        </template>
        <template v-if="column.key === 'creationDate'">
          <span>{{ $d(record.creationDate, 'mediumDate') }}</span>
        </template>
        <template v-if="column.key === 'modificationDate'">
          <span>{{ $d(record.modificationDate, 'mediumDate') }}</span>
        </template>
        <template v-if="column.key === 'visible'">
          <a-tag v-if="record.visible" color="success">
            {{ $t('EMAIL_TEMPLATES.EMAIL_LAYOUT.PUBLIC') }}
          </a-tag>
          <a-tag v-else color="default"> {{ $t('EMAIL_TEMPLATES.EMAIL_LAYOUT.PRIVATE') }}</a-tag>
        </template>
        <template v-if="column.key === 'action'">
          <a-dropdown overlay-class-name="email-layout-table__dropdown" placement="bottomRight" :trigger="['click']">
            <a-button class="ls-detail ls-button ls-primary">
              <detail-icon width="16px" height="16px"></detail-icon>
            </a-button>
            <template #overlay>
              <a-menu>
                <a-menu-item> <CopyOutlined></CopyOutlined> {{ $t('GENERAL.DUPPLICATE') }} </a-menu-item>
                <a-menu-item
                  v-if="!checkingEmailLayoutsDomainAuthorized(record.domain)"
                  @click="onEditMailLayout(record)"
                >
                  <ViewIcon></ViewIcon> {{ $t('GENERAL.VIEW') }}
                </a-menu-item>
                <a-menu-item
                  v-if="checkingEmailLayoutsDomainAuthorized(record.domain)"
                  @click="onEditMailLayout(record)"
                >
                  <EditIcon></EditIcon> {{ $t('GENERAL.EDIT') }}
                </a-menu-item>
                <a-menu-item
                  v-if="checkingEmailLayoutsDomainAuthorized(record.domain)"
                  class="delete"
                  @click="onDeleteMailLayout(record)"
                >
                  <DeleteIcon></DeleteIcon> {{ $t('GENERAL.DELETE') }}
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </template>
    </a-table>
    <ThePagination v-model="pagination" class="pagination" :is-visible="!!items?.length" />
  </div>
</template>
<script lang="ts" setup>
import { computed, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { STATUS } from '@/core/types/Status';
import ThePagination from '@/core/components/the-pagination.vue';
import { DEFAULT_PAGE_SIZE } from '@/core/constants/pagination';
import { MailLayout } from '../../types/MailLayout';
import useEmailTemplatesLayout from '../../hooks/useEmailTemplatesLayout';
import DetailIcon from '@/core/components/icons/detail-icon.vue';
import EditIcon from '@/core/components/icons/edit-icon.vue';
import ViewIcon from '@/core/components/icons/view-icon.vue';
import DeleteIcon from '@/core/components/icons/delete-icon.vue';
import { CopyOutlined } from '@ant-design/icons-vue';

// props
const props = defineProps<{
  items: MailLayout[];
  status: STATUS;
  editable?: boolean;
}>();
const emits = defineEmits(['toggle', 'toggle-all']);

const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: DEFAULT_PAGE_SIZE,
});

// composable
const { t } = useI18n();
const { selectedMailLayouts, checkingEmailLayoutsDomainAuthorized, onDeleteMailLayout, onEditMailLayout } =
  useEmailTemplatesLayout();

// computed
const rowSelection = computed(() => ({
  checkStrictly: false,
  selectedRowKeys: selectedMailLayouts.value?.map((item) => item.uuid) ?? [],
  onSelect: (record: MailLayout, selected: boolean, selectedRows: MailLayout[]) => {
    selectedMailLayouts.value = selectedRows;
  },
  onSelectAll: (selected: boolean, selectedRows: MailLayout[], changeRows: MailLayout[]) => {
    selectedMailLayouts.value = selectedRows;
  },
  onChange: (selected: boolean, selectedRows: MailLayout[], changeRows: MailLayout[]) => {
    selectedMailLayouts.value = selectedRows;
  },
}));
const mimeTypesByPage = computed(() => {
  const firstIndex = (pagination.current - 1) * pagination.pageSize;
  const lastIndex = pagination.current * pagination.pageSize;

  return props.items.slice(firstIndex, lastIndex);
});

const columns = computed(() => [
  {
    title: t('GENERAL.NAME'),
    key: 'description',
    sorter: (a: MailLayout, b: MailLayout) => a.description?.localeCompare(b.description),
  },
  {
    title: t('EMAIL_TEMPLATES.READ_ONLY'),
    key: 'readonly',
    sorter: (a: MailLayout, b: MailLayout) => Number(b.readonly) - Number(a.readonly),
  },
  {
    title: t('GENERAL.DOMAIN'),
    key: 'domain',
    sorter: (a: MailLayout, b: MailLayout) => a.domainName?.localeCompare(b.domainName),
  },
  {
    title: t('GENERAL.CREATION_DATE'),
    key: 'creationDate',
    sorter: (a: MailLayout, b: MailLayout) => (a.creationDate || 0) - (b.creationDate || 0),
  },
  {
    title: t('GENERAL.MODIFICATION_DATE'),
    key: 'modificationDate',
    sorter: (a: MailLayout, b: MailLayout) => (b.modificationDate || 0) - (a.modificationDate || 0),
    defaultSortOrder: 'descend',
  },
  {
    title: t('EMAIL_TEMPLATES.VISIBILITY'),
    key: 'visible',
    sorter: (a: MailLayout, b: MailLayout) => Number(b.visible) - Number(a.visible),
  },
  {
    title: t('GENERAL.ACTIONS'),
    key: 'action',
  },
]);

watch(
  () => props.items,
  async (newVal) => {
    pagination.total = newVal?.length;
  }
);
</script>

<style lang="less">
.email-layout-table {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 16px;

  &__table .ant-table {
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    overflow: hidden;
  }

  .ant-tag.ant-tag-success {
    padding: 4px 8px;
    gap: 8px;
    min-width: 44px;
    height: 24px;
    background: #e8f4ff;
    border-radius: 5px;
    color: #007aff;
    border: none;
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 16px;
  }

  .ant-tag.ant-tag-red {
    padding: 4px 8px;
    gap: 8px;
    min-width: 44px;
    height: 24px;
    background: #fff3f3;
    border-radius: 5px;
    color: #ea3c3c;
    border: none;
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 16px;
  }

  .ant-tag.ant-tag-default {
    padding: 4px 8px;
    gap: 8px;
    min-width: 44px;
    height: 24px;
    background: #f3f3f7;
    border-radius: 5px;
    color: #989cb1;
    border: none;
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 16px;
  }

  &__dropdown {
    background-color: transparent !important;
    box-shadow: none !important;

    .ant-dropdown-menu {
      padding: 8px;
      gap: 8px;
      width: 301px;
      height: 164px;
      background: #ffffff;
      box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.08), 0px 8px 24px rgba(0, 0, 0, 0.08);
      border-radius: 8px;
    }

    .ant-dropdown-menu-item {
      height: 48px;
      border-radius: 8px;
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      letter-spacing: -0.02em;
    }
    .ant-dropdown-menu-title-content {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 16px;
    }

    svg {
      color: #007aff;
    }
    .delete svg {
      color: #ea3c3c;
    }

    .ant-dropdown-menu-item:hover {
      color: #007aff;
    }
  }
}
</style>
