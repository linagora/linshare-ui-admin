<script lang="ts" setup>
import { ref } from 'vue';
import TheSubheader from '@/core/components/the-subheader.vue';
import FilterIcon from '@/core/components/icons/filter-icon.vue';
import ReportingFiltersModal from './reporting-filters-modal.vue';
import ReportingFiltersList from './reporting-filters-list.vue';
import ReportingStatisticGenerics from './reporting-statistic-generics.vue';

const showFilterModal = ref(false);
</script>

<template>
  <the-subheader>
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
.card {
  margin: 20px;
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
