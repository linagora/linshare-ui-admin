<template>
  <div class="upgrade-list-table">
    <a-table
      key="identifier"
      class="upgrade-list-table__table"
      :columns="columns"
      :pagination="false"
      :data-source="tasks"
      :loading="loading"
      row-key="identifier"
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'no'">
          <span class="elipsis-name" :title="record.taskOrder">{{ index + 1 }}</span>
        </template>
        <template v-if="column.key === 'taskOrder'">
          <span class="elipsis-name" :title="record.taskOrder">{{ record.taskOrder }}</span>
        </template>
        <template v-else-if="column.key === 'creationDate'">
          <span>{{ $d(record?.creationDate, 'mediumDate') }}</span>
        </template>
        <template v-else-if="column.key === 'modificationDate'">
          <span>{{ $d(record?.modificationDate, 'mediumDate') }}</span>
        </template>
        <template v-else-if="column.key === 'processingDuration'">
          <span>{{ humandaryDuration(record?.processingDuration, locale) }}</span>
        </template>
        <template v-else-if="column.key === 'status'">
          <a-tag v-if="record?.status === 'SUCCESS'" color="success">
            {{ $t('UPGRADE_TASK.SUCCESS') }}
          </a-tag>
          <a-tag v-else color="red"> {{ $t('UPGRADE_TASK.FAILED') }}</a-tag>
        </template>
        <template v-else-if="column.key === 'action'">
          <a-button class="ls-console ls-button ls-primary" @click="onShowConsole(record)">
            <CreditCardOutlined :style="{ color: '#007AFF' }"></CreditCardOutlined>
          </a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { AsyncTask } from '../types/UpgradeTask';
import { CreditCardOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { UPGRADES_TEMPLATES_ROUTE_NAMES } from '../router';
import { useRoute } from 'vue-router';
import { humandaryDuration } from '@/core/utils/date';

const { locale } = useI18n();

defineProps<{
  tasks: AsyncTask[];
  loading: boolean;
}>();

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
// computed

const columns = computed(() => [
  {
    width: '100px',
    title: t('GENERAL.NO'),
    key: 'no',
  },
  {
    title: t('UPGRADE_TASK.STATUS'),
    align: 'center',
    dataIndex: ['status'],
    sorter: (a: AsyncTask, b: AsyncTask) => a.status.localeCompare(b.status),
    key: 'status',
  },
  {
    title: t('GENERAL.CREATION_DATE'),
    align: 'center',
    dataIndex: ['creationDate'],
    sorter: (a: AsyncTask, b: AsyncTask) => (a.creationDate || 0) - (b.creationDate || 0),
    key: 'creationDate',
  },
  {
    title: t('GENERAL.MODIFICATION_DATE'),
    align: 'center',
    dataIndex: ['modificationDate'],
    sorter: (a: AsyncTask, b: AsyncTask) => (a.modificationDate || 0) - (b.modificationDate || 0),
    key: 'modificationDate',
  },
  {
    title: t('UPGRADE_TASK.DURATION'),
    align: 'center',
    dataIndex: ['processingDuration'],
    sorter: (a: AsyncTask, b: AsyncTask) => (a.processingDuration || 0) - (b.processingDuration || 0),
    key: 'processingDuration',
  },
  {
    title: t('GENERAL.ACTIONS'),
    align: 'right',
    key: 'action',
  },
]);

function onShowConsole(record) {
  const task = route.params.id;
  router.push({
    name: UPGRADES_TEMPLATES_ROUTE_NAMES.UPGRADES_DETAIL_CONSOLE,
    params: { identifier: task, id: record.uuid },
  });
}
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

  .ls-console {
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
    margin-left: auto;
    margin-right: 0;
  }
}
</style>
