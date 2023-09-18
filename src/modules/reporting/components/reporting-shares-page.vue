<script lang="ts" setup>
import { ref } from 'vue';
import TheSubheader from '@/core/components/the-subheader.vue';
import FilterIcon from '@/core/components/icons/filter-icon.vue';
import ReportingSharesFiltersModal from './reporting-shares-filters-modal.vue';
import ReportingSharesFiltersList from './reporting-shares-filters-list.vue';
import TopSharesByFileCount from './top-shares-by-file-count.vue';
import TopSharesByFileSize from './top-shares-by-file-size.vue';
import { storeToRefs } from 'pinia';
import { useReportingSharesStore } from '../store';

const showFilterModal = ref(false);
const { top } = storeToRefs(useReportingSharesStore());
</script>
<template>
  <the-subheader :title="$t('NAVIGATOR.REPORTING')" :detail="$t('REPORTING.INTRODUCTION')">
    <template #action>
      <a-button @click="showFilterModal = true">
        <template #icon>
          <filter-icon class="anticon"></filter-icon>
        </template>
        {{ $t('REPORTING.FILTERS_BUTTON') }}
      </a-button>
    </template>
    <template #extra>
      <reporting-shares-filters-list></reporting-shares-filters-list>
    </template>
  </the-subheader>

  <reporting-shares-filters-modal
    :visible="showFilterModal"
    @close="showFilterModal = false"
  ></reporting-shares-filters-modal>

  <div class="page-wrapper">
    <a-row>
      <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
        <div class="first-row">
          <div class="card">
            <div class="header">
              <span class="title">{{ $t('REPORTING.TOP_RECEIVERS.FILE_COUNT.TITLE', { pageNumber: top }) }}</span>
            </div>
            <div class="content">
              <top-shares-by-file-count></top-shares-by-file-count>
            </div>
          </div>
        </div>
      </a-col>
      <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
        <div class="second-row">
          <div class="card">
            <div class="header">
              <span class="title">{{ $t('REPORTING.TOP_RECEIVERS.FILE_SIZE.TITLE', { pageNumber: top }) }}</span>
            </div>
            <div class="content">
              <top-shares-by-file-size></top-shares-by-file-size>
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<style lang="less" scoped>
.page-wrapper {
  padding: 10px;

  .first-col {
    display: flex;
    flex-direction: column;
    height: 100%;
    .first-row {
      flex: 0;
    }

    .second-row {
      flex: 1;
      display: flex;
      flex-direction: column;

      .card {
        flex: 1;
      }
    }

    @media (min-width: @screen-lg-min) {
      .second-row {
        flex-direction: row;
      }
    }
  }
}
.card {
  margin: 10px;
  padding: 32px;
  background-color: @white;
  border-radius: 10px;

  .header {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;

    .title {
      font-size: 24px;
      font-weight: 700;
    }

    .description {
      color: @text-color-secondary;
    }
  }
}
</style>
