<script lang="ts" setup>
import { ref } from 'vue';
import TheSubheader from '@/core/components/the-subheader.vue';
import FilterIcon from '@/core/components/icons/filter-icon.vue';
import ReportingFiltersModal from './reporting-filters-modal.vue';
import ReportingFiltersList from './reporting-filters-list.vue';

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
</template>
