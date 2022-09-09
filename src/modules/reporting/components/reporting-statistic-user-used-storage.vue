<script lang="ts" setup>
import { ref, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { SORT_ORDER } from '@/core/types/Sort';
import { useDomainStore } from '@/modules/domain/store';
import { useReportingStore } from '../store';
import { getAccountQuotaStatistics } from '../services/statistic-api';
import type { AccountQuotaStatistic } from '../types/AccountQuotaStatistic';
import ReportingStatisticUserUsedStorageTable from './reporting-statistic-user-used-storage-table.vue';

const { currentDomain } = storeToRefs(useDomainStore());
const { domains, endDate, beginDate, category } = storeToRefs(useReportingStore());
const data = ref<AccountQuotaStatistic[]>([]);
const loading = ref(false);

async function fetchAll() {
  loading.value = true;
  data.value = [];

  if (!domains.value.length) {
    await fetchAccountQuota();
  } else {
    for (let index = 0; index < domains.value.length; index++) {
      await fetchAccountQuota(domains.value[index].uuid);
    }
  }

  loading.value = false;
}

async function fetchAccountQuota(domainUuid?: string) {
  const res = await getAccountQuotaStatistics(domainUuid || currentDomain.value.uuid, {
    includeNestedDomains: domains.value.length === 0,
    beginDate: beginDate.value?.format('YYYY-MM-DD'),
    endDate: endDate.value?.format('YYYY-MM-DD'),
    type: category.value === 'WHOLE_DOMAIN' ? undefined : category.value === 'SHARED_SPACE' ? 'WORK_GROUP' : 'USER',
    size: 100,
    sortField: 'usedSpace',
    sortOrder: SORT_ORDER.DESC,
  });

  res.data.forEach((statistic) => {
    if (!data.value[0] || data.value[0].usedSpace < statistic.usedSpace) {
      const length = data.value.unshift(statistic);

      if (length > 100) {
        data.value.pop();
      }
    } else if (statistic.usedSpace < data.value[data.value.length - 1].usedSpace) {
      if (data.value.length < 100) {
        data.value.push(statistic);
      }
    } else {
      const index = searchNearestIndexByUsedSpace(statistic, 0, data.value.length - 1);

      data.value.splice(index, 0, statistic);

      if (length > 100) {
        data.value.pop();
      }
    }
  });

  function searchNearestIndexByUsedSpace(x: AccountQuotaStatistic, start: number, end: number): number {
    if (start > end) return start;

    let mid = Math.floor((start + end) / 2);

    if (data.value[mid].usedSpace === x.usedSpace) return mid;
    if (data.value[mid].usedSpace < x.usedSpace) {
      return searchNearestIndexByUsedSpace(x, start, mid - 1);
    }

    return searchNearestIndexByUsedSpace(x, mid + 1, end);
  }
}

watchEffect(fetchAll);
</script>

<template>
  <reporting-statistic-user-used-storage-table :data="data" :loading="loading" />
</template>
