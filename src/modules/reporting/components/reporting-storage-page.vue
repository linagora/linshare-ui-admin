<script lang="ts" setup>
import { ref } from 'vue';
import TheSubheader from '@/core/components/the-subheader.vue';
import FilterIcon from '@/core/components/icons/filter-icon.vue';
import ReportingFiltersModal from './reporting-filters-modal.vue';
import ReportingFiltersList from './reporting-filters-list.vue';
import ReportingStatisticGenerics from './reporting-statistic-generics.vue';
import ReportingStatisticFilesQuantity from './reporting-statistic-files-quantity.vue';
import ReportingStatisticStorageConsumption from './reporting-statistic-storage-consumption.vue';
import ReportingStatisticUserUsedStorage from './reporting-statistic-user-used-storage.vue';
import ReportingStatisticSummary from './reporting-statistic-summary.vue';
import ReportingStatisticTotalStorage from './reporting-statistic-total-storage.vue';
import ReportingStatisticMostUploaded from './reporting-statistic-most-uploaded.vue';

const showFilterModal = ref(false);
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
      <reporting-filters-list></reporting-filters-list>
    </template>
  </the-subheader>

  <reporting-filters-modal :visible="showFilterModal" @close="showFilterModal = false"></reporting-filters-modal>

  <div class="page-wrapper">
    <a-row>
      <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
        <div class="first-col">
          <div class="first-row">
            <div class="card">
              <div class="header">
                <span class="title">{{ $t('REPORTING.SUMMARY.TITLE') }}</span>
                <span class="description">{{ $t('REPORTING.SUMMARY.DESCRIPTION') }}</span>
              </div>

              <div class="content">
                <reporting-statistic-summary></reporting-statistic-summary>
              </div>
            </div>
          </div>

          <div class="second-row">
            <div class="card">
              <div class="header">
                <span class="title">{{ $t('REPORTING.TOTAL_STORAGE.TITLE') }}</span>
                <span class="description">{{ $t('REPORTING.TOTAL_STORAGE.DESCRIPTION') }}</span>
              </div>

              <div class="content">
                <reporting-statistic-total-storage></reporting-statistic-total-storage>
              </div>
            </div>

            <div class="card">
              <div class="header">
                <span class="title">{{ $t('REPORTING.MOST_UPLOADED.TITLE') }}</span>
                <span class="description">{{ $t('REPORTING.MOST_UPLOADED.DESCRIPTION') }}</span>
              </div>

              <div class="content">
                <reporting-statistic-most-uploaded></reporting-statistic-most-uploaded>
              </div>
            </div>
          </div>
        </div>
      </a-col>

      <a-col :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
        <a-row>
          <a-col span="24">
            <div class="card">
              <div class="header">
                <span class="title">{{ $t('REPORTING.STORAGE_CONSUMPTION.TITLE') }}</span>
                <span class="description">{{ $t('REPORTING.STORAGE_CONSUMPTION.DESCRIPTION') }}</span>
              </div>

              <div class="content">
                <reporting-statistic-storage-consumption></reporting-statistic-storage-consumption>
              </div>
            </div>
          </a-col>

          <a-col span="24">
            <div class="card">
              <div class="header">
                <span class="title">{{ $t('REPORTING.FILES_QUANTITY.TITLE') }}</span>
                <span class="description">{{ $t('REPORTING.FILES_QUANTITY.DESCRIPTION') }}</span>
              </div>

              <div class="content">
                <reporting-statistic-files-quantity></reporting-statistic-files-quantity>
              </div>
            </div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <div class="card">
      <div class="header">
        <span class="title">{{ $t('REPORTING.USER_USED_STORAGE.TITLE') }}</span>
        <span class="description">{{ $t('REPORTING.USER_USED_STORAGE.DESCRIPTION') }}</span>
      </div>

      <div class="content">
        <reporting-statistic-user-used-storage></reporting-statistic-user-used-storage>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="header">
      <span class="title">{{ $t('REPORTING.GENERICS.TITLE') }}</span>
      <span class="description">{{ $t('REPORTING.GENERICS.DESCRIPTION') }}</span>
    </div>

    <div class="content">
      <reporting-statistic-generics></reporting-statistic-generics>
    </div>
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
