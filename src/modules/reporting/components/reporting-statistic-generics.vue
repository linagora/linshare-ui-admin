<script lang="ts" setup>
import { useDomainStore } from '@/modules/domain/store';
import { storeToRefs } from 'pinia';
import { computed, ref, watchEffect } from 'vue';
import { getGenericStatistics } from '../services/statistic-api';
import { useReportingStore } from '../store';
import { GenericResourceStatistic, GenericStatisticByResource } from '../types/GenericStatistic';
import ReportingStatisticGenericsTable from './reporting-statistic-generics-table.vue';
import ReportingStatisticGenericsList from './reporting-statistic-generics-list.vue';

const { currentDomain } = storeToRefs(useDomainStore());
const { domains, endDate, beginDate, category } = storeToRefs(useReportingStore());
const data = ref<GenericStatisticByResource>({});
const loading = ref(false);
const dataList = computed<GenericResourceStatistic[]>(() => {
  return Object.keys(data.value).map((key) => ({
    resource: key,
    ...data.value[key],
  }));
});

async function fetchAll() {
  loading.value = true;
  data.value = {};

  if (!domains.value.length) {
    await fetchGenericDomainStatistic();
  } else {
    for (let index = 0; index < domains.value.length; index++) {
      await fetchGenericDomainStatistic(domains.value[index].uuid);
    }
  }

  loading.value = false;
}

async function fetchGenericDomainStatistic(domainUuid?: string) {
  let page = 0;
  let done = false;

  while (!done) {
    const res = await getGenericStatistics(domainUuid || currentDomain.value.uuid, {
      page,
      includeNestedDomains: domains.value.length === 0,
      beginDate: beginDate.value?.format('YYYY-MM-DD'),
      endDate: endDate.value?.format('YYYY-MM-DD'),
      sum: true,
      sumBy: ['action', 'resourceType'],
      resourceGroup:
        category.value === 'WHOLE_DOMAIN'
          ? undefined
          : category.value === 'SHARED_SPACE'
          ? 'SHARED_SPACES'
          : 'MY_SPACE',
    });

    res.data.forEach((statistic) => {
      if (!data.value[statistic.resourceType]) {
        data.value[statistic.resourceType] = {
          CREATE: 0,
          DELETE: 0,
          DOWNLOAD: 0,
          FAILURE: 0,
          GET: 0,
          PURGE: 0,
          SUCCESS: 0,
          UPDATE: 0,
        };
        data.value[statistic.resourceType][statistic.action] = statistic.value;
      } else {
        data.value[statistic.resourceType][statistic.action] += statistic.value;
      }
    });

    if (page + 1 === res.totalPages || res.totalPages === 0) {
      done = true;
    } else {
      page++;
    }
  }
}

watchEffect(fetchAll);
</script>

<template>
  <div class="table">
    <reporting-statistic-generics-table :data="dataList" :loading="loading"></reporting-statistic-generics-table>
  </div>
  <div class="list">
    <reporting-statistic-generics-list :data="dataList" :loading="loading"></reporting-statistic-generics-list>
  </div>
</template>

<style lang="less" scoped>
.table {
  display: none;
}

@media (min-width: @screen-xl-min) {
  .table {
    display: block;
  }

  .list {
    display: none;
  }
}
</style>
