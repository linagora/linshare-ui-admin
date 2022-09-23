<script lang="ts" setup>
import Domain from '@/modules/domain/types/Domain';
import { storeToRefs } from 'pinia';
import { useReportingStore } from '../store';
import LsTag from '@/core/components/ls/ls-tag.vue';
import { TimePeriod } from '@/core/types/TimePeriod';
import { computed } from 'vue';
import { getPeriodFromDate } from '@/core/utils/date';
import { useI18n } from 'vue-i18n';

const { domains, category, beginDate, endDate } = storeToRefs(useReportingStore());
const { t, d } = useI18n();
const dateRange = computed(() => {
  const period: TimePeriod = getPeriodFromDate(beginDate.value, endDate.value);

  if (period === 'CUSTOM' && beginDate.value && endDate.value) {
    return `${d(beginDate.value.toDate(), 'shortDate')} - ${d(endDate.value.toDate(), 'shortDate')}`;
  }

  return t(`GENERAL.DATE_${period}`);
});

function removeDomainFromFilter(toBeRemoved: Domain) {
  domains.value = domains.value.filter((domain) => domain.uuid !== toBeRemoved.uuid);
}
</script>

<template>
  <div class="filter-list">
    <div v-if="domains.length > 0" class="filter">
      <span class="filter__type">{{ $t('REPORTING.FILTERS_BAR.DOMAIN_FILTER') }}</span>
      <ls-tag
        v-for="domain in domains"
        :key="domain.uuid"
        :value="domain.name"
        :closable="true"
        @close="removeDomainFromFilter(domain)"
      ></ls-tag>
    </div>
    <div v-else class="filter">
      <span class="filter__type">{{ $t('REPORTING.FILTERS_BAR.DOMAIN_FILTER') }}</span>
      <ls-tag :value="$t('REPORTING.FILTERS_BAR.ALL_DOMAINS')"></ls-tag>
    </div>

    <div class="filter">
      <span class="filter__type">{{ $t('REPORTING.FILTERS_BAR.CATEGORY_FILTER') }}</span>
      <ls-tag :value="$t(`REPORTING.FILTERS_MODAL.CATEGORIES_${category}`)"></ls-tag>
    </div>
    <div class="filter">
      <span class="filter__type">{{ $t('REPORTING.FILTERS_BAR.TIME_RANGE_FILTER') }}</span>
      <ls-tag :value="dateRange"></ls-tag>
    </div>
  </div>
</template>

<style lang="less" scoped>
.filter-list {
  display: flex;
  flex-wrap: wrap;

  .filter {
    display: flex;
    align-items: center;
    margin-top: 5px;

    &__type {
      color: #6d7885;
      margin-right: 5px;
    }
  }
}
</style>
