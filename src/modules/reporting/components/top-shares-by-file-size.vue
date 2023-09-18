<template>
  <a-table
    class="files-size-data-table"
    :data-source="filteredListByPage"
    :loading="loading"
    :columns="columns"
    :pagination="false"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'recipientMail'">
        {{ record.recipientMail }}
      </template>
      <template v-if="column.key === 'numberOfFiles'">
        {{ getReadableSize(record.shareTotalSize).getText() }}
      </template>
    </template>
  </a-table>
  <thePagination v-model="topSharesFileSizePagination" :is-visible="!!filteredListByPage.length"></thePagination>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useTopSharesFilesSize } from '../hooks/useTopSharesFilesSize';
import { useI18n } from 'vue-i18n';
import thePagination from '@/core/components/the-pagination.vue';
import { TopSharesFileSizeItem } from '../types/TopSharesFileSize';
import { getReadableSize } from '@/core/utils/unitStorage';

const { t } = useI18n();
const { getSharesByFileSizeInformations, loading, filteredListByPage, topSharesFileSizePagination } =
  useTopSharesFilesSize();

const columns = computed(() => [
  {
    title: t('REPORTING.TOP_RECEIVERS.FILE_SIZE.RECEIVER_MAIL'),
    key: 'recipientMail',
    sorter: (a: TopSharesFileSizeItem, b: TopSharesFileSizeItem) => a.recipientMail?.localeCompare(b.recipientMail),
  },
  {
    title: t('REPORTING.TOP_RECEIVERS.FILE_SIZE.SIZE_OF_SHARED_FILES'),
    key: 'numberOfFiles',
    sorter: (a: TopSharesFileSizeItem, b: TopSharesFileSizeItem) => a.shareTotalSize - b.shareTotalSize,
  },
]);

getSharesByFileSizeInformations();
</script>

<style lang="less">
.files-size-data-table {
  .ant-table {
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    overflow: hidden;
  }

  &__actor {
    color: #007aff;
  }

  .ls-detail {
    width: 30px;
    height: 30px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0;
    margin: 0 auto;
  }

  &__detail-modal {
    .ant-popover-inner {
      padding: 12px;
      gap: 16px;
      position: relative;
      width: 400px;
      height: fit-content;
      background: #ffffff;
      box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.08), 0px 8px 24px rgba(0, 0, 0, 0.08);
      border-radius: 12px;
    }

    .ant-popover-title {
      font-weight: 600;
      font-size: 15px;
      line-height: 20px;
      display: flex;
      align-items: center;
      color: #007aff;
    }

    .detail {
      font-weight: 500;
      font-size: 15px;
      color: #434657;
      margin-bottom: 16px;
    }

    .time {
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      display: flex;
      align-items: center;
      letter-spacing: -0.01em;
      color: #6d7885;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-start;
      gap: 12px;
    }

    .time span:first-child {
      border-right: 1px solid #d5d7e0;
      padding-right: 12px;
    }

    .icon {
      margin-right: 8px;
    }

    .ant-popover-title {
      padding-bottom: 16px;
    }
  }
}
</style>
