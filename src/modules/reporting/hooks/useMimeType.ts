import { useDomainStore } from '@/modules/domain/store';
import { storeToRefs } from 'pinia';
import { computed, ref, watchEffect } from 'vue';
import { getMimeTypeStatistics } from '../services/statistic-api';
import { useReportingStore } from '../store';
import { StatisticByMimeType } from '../types/MimeTypeStatistic';

const loading = ref(true);
const statisticByMimeType = ref<StatisticByMimeType>({});
const totalUploadedSize = computed(() =>
  Object.values(statisticByMimeType.value).reduce((size, stat) => (size += stat.totalSize), 0)
);
const { domains, beginDate, endDate } = storeToRefs(useReportingStore());
const { currentDomain } = storeToRefs(useDomainStore());

async function fetchAll() {
  loading.value = true;
  statisticByMimeType.value = {};

  const data: StatisticByMimeType = {};

  if (!domains.value.length) {
    await fetchMimeTypeStatistic(data, currentDomain.value.uuid);
  } else {
    for (let index = 0; index < domains.value.length; index++) {
      await fetchMimeTypeStatistic(data, domains.value[index].uuid);
    }
  }

  statisticByMimeType.value = data;
  loading.value = false;
}

async function fetchMimeTypeStatistic(data: StatisticByMimeType, domainUuid: string) {
  let page = 0;
  let done = false;

  while (!done) {
    const res = await getMimeTypeStatistics(domainUuid, {
      page,
      includeNestedDomains: domains.value.length === 0,
      beginDate: beginDate.value?.format('YYYY-MM-DD'),
      endDate: endDate.value?.format('YYYY-MM-DD'),
    });

    res.data.forEach((stat) => {
      if (!data[stat.mimeType]) {
        data[stat.mimeType] = {
          humanMimeType: stat.humanMimeType,
          totalSize: stat.totalSize,
          totalCount: stat.value,
        };
      } else {
        data[stat.mimeType].humanMimeType = stat.humanMimeType;
        data[stat.mimeType].totalCount += stat.value || 0;
        data[stat.mimeType].totalSize += stat.totalSize || 0;
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

export function useMimeType() {
  return {
    loading,
    statisticByMimeType,
    totalUploadedSize,
  };
}
