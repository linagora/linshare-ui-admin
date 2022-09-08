import { ref, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import dayjs, { Dayjs } from 'dayjs';
import { useDomainStore } from '@/modules/domain/store';
import { getStorageConsumptionStatistics } from '../services/statistic-api';
import { ReportingCategory, useReportingStore } from '../store';
import type {
  StorageConsumptionStatisticByDate,
  StorageConsumtptionStatisticType,
} from '../types/StorageConsumptionStatistic';

const STATISTIC_TYPE_DATE_FORMAT_MAPPING: Record<StorageConsumtptionStatisticType, string> = {
  DOMAIN_DAILY_STAT: 'DD/MM',
  DOMAIN_WEEKLY_STAT: 'w',
  DOMAIN_MONTHLY_STAT: 'MM/YYYY',
  USER_DAILY_STAT: 'DD/MM',
  USER_WEEKLY_STAT: 'w',
  USER_MONTHLY_STAT: 'MM/YYYY',
  WORK_GROUP_DAILY_STAT: 'DD/MM',
  WORK_GROUP_WEEKLY_STAT: 'w',
  WORK_GROUP_MONTHLY_STAT: 'MM/YYYY',
};

const { currentDomain } = storeToRefs(useDomainStore());
const { category, domains, beginDate, endDate } = storeToRefs(useReportingStore());
const dataByTime = ref<StorageConsumptionStatisticByDate>({});
const dataType = ref<StorageConsumtptionStatisticType>('DOMAIN_DAILY_STAT');
const loading = ref(false);

async function fetchAll() {
  loading.value = true;
  dataType.value = getStatisticType(category.value, beginDate.value, endDate.value);
  const data: StorageConsumptionStatisticByDate = initializeData(beginDate.value, endDate.value);

  if (!domains.value.length) {
    await fetchStorageConsumptionStatistics(data, currentDomain.value.uuid);
  } else {
    for (let index = 0; index < domains.value.length; index++) {
      await fetchStorageConsumptionStatistics(data, domains.value[index].uuid);
    }
  }

  dataByTime.value = data;
  loading.value = false;
}

async function fetchStorageConsumptionStatistics(data: StorageConsumptionStatisticByDate, domainUuid: string) {
  let page = 0;
  let done = false;

  while (!done) {
    const res = await getStorageConsumptionStatistics(domainUuid, {
      page,
      includeNestedDomains: domains.value.length === 0,
      beginDate: beginDate.value?.format('YYYY-MM-DD'),
      endDate: endDate.value?.format('YYYY-MM-DD'),
      type: dataType.value,
    });

    res.data.forEach((stat) => {
      const time = dayjs(stat.statisticDate).format(STATISTIC_TYPE_DATE_FORMAT_MAPPING[dataType.value]);

      if (!data[time]) {
        data[time] = {
          actualOperationSum: stat.actualOperationSum || 0,
          countOfAddedFiles: stat.countOfAddedFiles || 0,
          countOfDeletedFiles: stat.countOfDeletedFiles || 0,
          countOfFiles: stat.countOfFiles || 0,
          diffOperationSum: stat.diffOperationSum || 0,
          sumOfAddedFiles: stat.sumOfAddedFiles || 0,
          sumOfDeletedFiles: stat.sumOfDeletedFiles || 0,
        };
      } else {
        data[time].actualOperationSum += stat.actualOperationSum || 0;
        data[time].countOfAddedFiles += stat.countOfAddedFiles || 0;
        data[time].countOfDeletedFiles += stat.countOfDeletedFiles || 0;
        data[time].countOfFiles += stat.countOfFiles || 0;
        data[time].diffOperationSum += stat.diffOperationSum || 0;
        data[time].sumOfAddedFiles += stat.sumOfAddedFiles || 0;
        data[time].sumOfDeletedFiles += stat.sumOfDeletedFiles || 0;
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

function getStatisticType(
  category: ReportingCategory,
  beginDate: Dayjs | null,
  endDate: Dayjs | null
): StorageConsumtptionStatisticType {
  if (category === 'MY_SPACE') {
    if (beginDate && endDate && endDate.diff(beginDate, 'days') <= 7) {
      return 'USER_DAILY_STAT';
    } else if (beginDate && endDate && endDate.diff(beginDate, 'weeks') < 6) {
      return 'USER_WEEKLY_STAT';
    } else {
      return 'USER_WEEKLY_STAT';
    }
  } else if (category === 'SHARED_SPACE') {
    if (beginDate && endDate && endDate.diff(beginDate, 'days') <= 7) {
      return 'WORK_GROUP_DAILY_STAT';
    } else if (beginDate && endDate && endDate.diff(beginDate, 'weeks') < 6) {
      return 'WORK_GROUP_WEEKLY_STAT';
    } else {
      return 'WORK_GROUP_MONTHLY_STAT';
    }
  } else {
    if (beginDate && endDate && endDate.diff(beginDate, 'days') <= 7) {
      return 'DOMAIN_DAILY_STAT';
    } else if (beginDate && endDate && endDate.diff(beginDate, 'weeks') < 6) {
      return 'DOMAIN_WEEKLY_STAT';
    } else {
      return 'DOMAIN_MONTHLY_STAT';
    }
  }
}

function initializeData(beginDate: Dayjs | null, endDate: Dayjs | null): StorageConsumptionStatisticByDate {
  const data: StorageConsumptionStatisticByDate = {};

  if (!beginDate || !endDate) return data;

  const unit = dataType.value.endsWith('DAILY_STAT')
    ? 'day'
    : dataType.value.endsWith('WEEKLY_STAT')
    ? 'week'
    : 'month';
  const isMonday = (date: Dayjs) => date.get('day') === 1;
  const isFirstDayOfMonth = (date: Dayjs) => date.get('date') === 1;
  const getNextDay = (date: Dayjs) => date.set('date', date.get('date') + 1);

  for (let date = dayjs(beginDate); date < endDate; date = getNextDay(date)) {
    if (unit === 'day' || (unit === 'month' && isFirstDayOfMonth(date)) || (unit === 'week' && isMonday(date))) {
      data[date.format(STATISTIC_TYPE_DATE_FORMAT_MAPPING[dataType.value])] = {
        actualOperationSum: 0,
        countOfAddedFiles: 0,
        countOfDeletedFiles: 0,
        countOfFiles: 0,
        diffOperationSum: 0,
        sumOfAddedFiles: 0,
        sumOfDeletedFiles: 0,
      };
    }
  }

  return data;
}

export function useStorageConsumption() {
  return {
    loading,
    dataByTime,
    dataType,
  };
}
