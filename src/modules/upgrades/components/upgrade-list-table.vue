<template>
  <div class="upgrade-list-table">
    <upgrade-list-actions :loading="loading" @refresh="fetchUpgradeTask"></upgrade-list-actions>
    <a-table
      key="identifier"
      class="upgrade-list-table__table"
      :columns="columns"
      :pagination="false"
      :data-source="filteredListByPage"
      row-key="identifier"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'taskOrder'">
          <span class="elipsis-name" :title="record.taskOrder">{{ record.taskOrder }}</span>
        </template>
        <template v-else-if="column.key === 'creationDate'">
          <span>{{ $d(record?.creationDate, 'mediumDate') }}</span>
        </template>
        <template v-else-if="column.key === 'modificationDate'">
          <span>{{ $d(record?.modificationDate, 'mediumDate') }}</span>
        </template>
        <template v-else-if="column.key === 'priority'">
          <a-tag v-if="record?.priority === 'REQUIRED'" color="success">
            {{ $t('UPGRADE_TASK.REQUIRED') }}
          </a-tag>
          <a-tag v-else color="red"> {{ $t('UPGRADE_TASK.UN_REQUIRED') }}</a-tag>
        </template>
        <template v-else-if="column.key === 'status'">
          <a-tag v-if="record?.status === 'SUCCESS'" color="success">
            {{ $t('UPGRADE_TASK.SUCCESS') }}
          </a-tag>
          <a-tag v-else color="red"> {{ $t('UPGRADE_TASK.FAILED') }}</a-tag>
        </template>
        <template v-else-if="column.key === 'action'">
          <div class="actions">
            <a-dropdown overlay-class-name="upgrade-list-table__dropdown" placement="bottomRight" :trigger="['click']">
              <a-button class="ls-detail ls-button ls-primary">
                <detail-icon width="16px" height="16px"></detail-icon>
              </a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <UndoOutlined :style="{ color: '#007AFF' }" />
                    {{ $t('UPGRADE_TASK.RETRY_UPGRADES') }}
                  </a-menu-item>
                  <a-menu-item>
                    <HistoryOutlined :style="{ color: '#007AFF' }" /> {{ $t('UPGRADE_TASK.SHOW_PREVIEW') }}
                  </a-menu-item>
                  <a-menu-item>
                    <CreditCardOutlined :style="{ color: '#007AFF' }"></CreditCardOutlined>
                    {{ $t('UPGRADE_TASK.SHOW_CONSOLE') }}
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import useUpgradeTasks from '../hooks/useUpgradeTasks';
import { UpgradeTask } from '../types/UpgradeTask';
import DetailIcon from '@/core/components/icons/detail-icon.vue';
import UpgradeListActions from '@/modules/upgrades/components/upgrade-list-actions.vue';
import { CreditCardOutlined, HistoryOutlined, UndoOutlined } from '@ant-design/icons-vue';

const { filteredListByPage, loading, fetchUpgradeTask } = useUpgradeTasks();

const { t } = useI18n();

// computed

const columns = computed(() => [
  {
    width: '150px',
    title: t('GENERAL.NO'),
    sorter: (a: UpgradeTask, b: UpgradeTask) => a.taskOrder.toString().localeCompare(b.taskOrder.toString()),
    key: 'taskOrder',
  },
  {
    title: t('UPGRADE_TASK.UPGRADE_LIST.IDENTIFIER'),
    align: 'left',
    dataIndex: ['identifier'],
    sorter: (a: UpgradeTask, b: UpgradeTask) => a.identifier.localeCompare(b.identifier),
    key: 'identifier',
  },
  {
    title: t('UPGRADE_TASK.UPGRADE_LIST.CRITICALITY'),
    align: 'center',
    dataIndex: ['priority'],
    sorter: (a: UpgradeTask, b: UpgradeTask) => a.priority.localeCompare(b.priority),
    key: 'priority',
  },
  {
    title: t('UPGRADE_TASK.STATUS'),
    align: 'center',
    dataIndex: ['status'],
    sorter: (a: UpgradeTask, b: UpgradeTask) => a.status.localeCompare(b.status),
    key: 'status',
  },
  {
    title: t('GENERAL.MODIFICATION_DATE'),
    align: 'center',
    dataIndex: ['modificationDate'],
    sorter: (a: UpgradeTask, b: UpgradeTask) => (a.modificationDate || 0) - (b.modificationDate || 0),
    key: 'modificationDate',
  },
  {
    title: t('GENERAL.ACTIONS'),
    width: '100px',
    align: 'right',
    key: 'action',
  },
]);
</script>

<style lang="less">
.upgrade-list-table {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 16px;
  width: 100%;

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
      min-width: 100px;
      min-height: 100px;
      width: fit-content;
      height: fit-content;
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

  .actions {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }

  .ls-detail {
    width: 32px;
    height: 32px;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f2f8ff;
    border: 1px solid #a3dcff;
    color: #007aff;
    border-radius: 7px;
    transform: rotate(90deg);
  }
}
</style>
