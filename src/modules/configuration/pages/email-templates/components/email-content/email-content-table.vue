<template>
  <div class="email-content-table">
    <a-table
      key="uuid"
      class="email-content-table__table"
      :data-source="mailContentByPage"
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
        <template v-if="column.key === 'mailContentType'">
          <a-tooltip :title="t(`EMAIL_TEMPLATES.MAIL_CONTENT_TYPE.${record?.mailContentType}`)" trigger="hover">
            {{ record.mailContentType }}
          </a-tooltip>
        </template>
        <template v-if="column.key === 'readonly'">
          <a-tag v-if="record.readonly" color="red">
            {{ $t('EMAIL_TEMPLATES.READ_ONLY') }}
          </a-tag>
          <a-tag v-else color="success"> {{ $t('EMAIL_TEMPLATES.EDITABLE') }}</a-tag>
        </template>
        <template v-if="column.key === 'visible'">
          <a-tag v-if="record.visible" color="success">
            {{ $t('EMAIL_TEMPLATES.EMAIL_FOOTER.PUBLIC') }}
          </a-tag>
          <a-tag v-else color="default"> {{ $t('EMAIL_TEMPLATES.EMAIL_FOOTER.PRIVATE') }}</a-tag>
        </template>
        <template v-if="column.key === 'domain'">
          <span v-if="!checkingEmailContentsDomainAuthorized(record.domain)">{{ record.domainLabel }}</span>
          <router-link
            v-else-if="status === STATUS.SUCCESS"
            :to="{ name: 'ConfigurationDomainDetail', params: { domainUuid: record.domain } }"
          >
            <span>{{ record.domainLabel }}</span>
          </router-link>
        </template>
        <template v-if="column.key === 'creationDate'">
          <span>{{ $d(record.creationDate, 'mediumDate') }}</span>
        </template>
        <template v-if="column.key === 'modificationDate'">
          <span>{{ $d(record.modificationDate, 'mediumDate') }}</span>
        </template>
        <template v-if="column.key === 'action'">
          <a-dropdown overlay-class-name="email-content-table__dropdown" placement="bottomRight" :trigger="['click']">
            <a-button class="ls-detail ls-button ls-primary">
              <detail-icon width="16px" height="16px"></detail-icon>
            </a-button>
            <template #overlay>
              <a-menu>
                <a-menu-item
                  v-if="!checkingEmailContentsDomainAuthorized(record.domain) || record.readonly"
                  @click="onEditMailContent(record)"
                >
                  <ViewIcon></ViewIcon> {{ $t('GENERAL.VIEW') }}
                </a-menu-item>
                <a-menu-item
                  v-if="checkingEmailContentsDomainAuthorized(record.domain) && !record.readonly"
                  @click="onEditMailContent(record)"
                >
                  <EditIcon></EditIcon> {{ $t('GENERAL.EDIT') }}
                </a-menu-item>
                <a-menu-item
                  v-if="checkingEmailContentsDomainAuthorized(record.domain) && !record.readonly"
                  class="delete"
                  @click="onDeleteMailContent(record)"
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
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { STATUS } from '@/core/types/Status';
import ThePagination from '@/core/components/the-pagination.vue';
import { MailContent } from '../../types/MailContent';
import useEmailTemplatesContent from '../../hooks/useEmailTemplatesContent';
import DetailIcon from '@/core/components/icons/detail-icon.vue';
import EditIcon from '@/core/components/icons/edit-icon.vue';
import ViewIcon from '@/core/components/icons/view-icon.vue';
import DeleteIcon from '@/core/components/icons/delete-icon.vue';

// props
const props = defineProps<{
  items: MailContent[];
  status: STATUS;
  editable?: boolean;
}>();
const emits = defineEmits(['toggle', 'toggle-all']);

// composable
const { t } = useI18n();
const {
  selectedMailContents,
  checkingEmailContentsDomainAuthorized,
  onDeleteMailContent,
  onEditMailContent,
  pagination,
} = useEmailTemplatesContent();

// computed
const rowSelection = computed(() => ({
  checkStrictly: false,
  selectedRowKeys: selectedMailContents.value?.map((item) => item.uuid) ?? [],
  onSelect: (record: MailContent, selected: boolean, selectedRows: MailContent[]) => {
    selectedMailContents.value = selectedRows;
  },
  onSelectAll: (selected: boolean, selectedRows: MailContent[], changeRows: MailContent[]) => {
    selectedMailContents.value = selectedRows;
  },
  onChange: (selected: boolean, selectedRows: MailContent[], changeRows: MailContent[]) => {
    selectedMailContents.value = selectedRows;
  },
}));

const mailContentByPage = computed(() => {
  const firstIndex = (pagination.current - 1) * pagination.pageSize;
  const lastIndex = pagination.current * pagination.pageSize;
  return props.items.slice(firstIndex, lastIndex);
});

const columns = computed(() => [
  {
    title: t('GENERAL.NAME'),
    key: 'description',
    sorter: (a: MailContent, b: MailContent) => a.description?.localeCompare(b.description),
  },
  {
    title: t('EMAIL_TEMPLATES.MAIL_CONTENT_TYPE_NAME'),
    key: 'mailContentType',
    sorter: (a: MailContent, b: MailContent) => Number(b.readonly) - Number(a.readonly),
  },
  {
    title: t('EMAIL_TEMPLATES.READ_ONLY'),
    key: 'readonly',
    sorter: (a: MailContent, b: MailContent) => Number(b.readonly) - Number(a.readonly),
  },
  {
    title: t('EMAIL_TEMPLATES.VISIBILITY'),
    key: 'visible',
    sorter: (a: MailContent, b: MailContent) => Number(b.visible) - Number(a.visible),
  },
  {
    title: t('GENERAL.DOMAIN'),
    key: 'domain',
    sorter: (a: MailContent, b: MailContent) => a.domainLabel?.localeCompare(b.domainLabel),
  },
  {
    title: t('GENERAL.CREATION_DATE'),
    key: 'creationDate',
    sorter: (a: MailContent, b: MailContent) => (a.creationDate || 0) - (b.creationDate || 0),
  },
  {
    title: t('GENERAL.MODIFICATION_DATE'),
    key: 'modificationDate',
    sorter: (a: MailContent, b: MailContent) => (a.modificationDate || 0) - (b.modificationDate || 0),
    defaultSortOrder: 'descend',
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
.email-content-table {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 16px;

  &__table .ant-table {
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    overflow-x: auto;
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
      background: #ffffff;
      box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.08), 0px 8px 24px rgba(0, 0, 0, 0.08);
      border-radius: 8px;
    }

    .ant-dropdown-menu-item {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      letter-spacing: -0.02em;
    }
    .ant-dropdown-menu-title-content {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 4px;
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
