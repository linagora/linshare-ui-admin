<template>
  <div class="contact-list-table">
    <a-table
      key="identifier"
      class="contact-list-table__table"
      :columns="columns"
      :pagination="false"
      :data-source="filteredListByPage"
      :row-selection="rowSelection"
      row-key="identifier"
      :loading="status === STATUS.LOADING"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'identifier'">
          <div class="identifier">
            <div class="icon"></div>
            <div class="infor">
              <strong class="elipsis-name" :title="record.identifier">{{ record.identifier }}</strong>
              <span> {{ record?.owner?.mail }}</span>
            </div>
          </div>
        </template>
        <template v-else-if="column.key === 'domain'">
          <span>{{ record?.domain?.name }}</span>
        </template>
        <template v-else-if="column.key === 'public'">
          <a-tag v-if="record.public" color="success">
            {{ $t('GENERAL.PUBLIC') }}
          </a-tag>
          <a-tag v-else color="default"> {{ $t('GENERAL.PRIVATE') }}</a-tag>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Contact } from '../types/Contact';
import { STATUS } from '@/core/types/Status';
import useContactList from '../hooks/useContactList';

const { status, list, filteredListByPage, selectedContactLists } = useContactList();

const { t } = useI18n();

// computed

const rowSelection = computed(() => ({
  checkStrictly: false,
  selectedRowKeys: selectedContactLists.value?.map((item) => item.identifier) ?? [],
  onSelect: (record: Contact, selected: boolean, selectedRows: Contact[]) => {
    selectedContactLists.value = selectedRows;
  },
  onSelectAll: (selected: boolean, selectedRows: Contact[], changeRows: Contact[]) => {
    selectedContactLists.value = selectedRows;
  },
  onChange: (selected: boolean, selectedRows: Contact[], changeRows: Contact[]) => {
    selectedContactLists.value = selectedRows;
  },
}));

const columns = computed(() => [
  {
    width: '40%',
    title: t('GENERAL.CONTACT_NAME_AND_OWNER'),
    sorter: (a: Contact, b: Contact) => a.identifier.localeCompare(b.identifier),
    key: 'identifier',
  },
  {
    width: '40%',
    title: t('GENERAL.DOMAIN'),
    align: 'center',
    dataIndex: ['domain'],
    sorter: (a: Contact, b: Contact) => a.domainId.localeCompare(b.domainId),
    key: 'domain',
  },
  {
    title: t('GENERAL.VISIBILITY'),
    align: 'center',
    key: 'public',
  },
]);
</script>

<style lang="less">
.contact-list-table {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 16px;

  .identifier {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;

    .infor {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
    }

    .icon {
      width: 50px;
      height: 50px;
      background-color: #fafafa;
      border-radius: 100px;
      margin-right: 12px;
    }

    .infor strong {
      color: var(--neutral-colors-color-text-title, #1b1d29);
      /* Desktop/Subtitle 1 - Semibold */
      font-family: Inter;
      font-size: 17px;
      font-style: normal;
      font-weight: 600;
      line-height: 24px;
      /* 141.176% */
    }

    .infor span {
      color: var(--neutral-colors-color-placeholder, #989cb1);
      /* Desktop/Body 2 - Regular */
      font-family: Inter;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px;
      /* 142.857% */
      letter-spacing: -0.14px;
    }
  }

  &__table .ant-table {
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    overflow: auto;
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
