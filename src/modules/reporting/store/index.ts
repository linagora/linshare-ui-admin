import Domain from '@/modules/domain/types/Domain';
import dayjs, { Dayjs } from 'dayjs';
import { defineStore } from 'pinia';

export type ReportingCategory = 'WHOLE_DOMAIN' | 'SHARED_SPACE' | 'MY_SPACE';

interface ReportingStorageStore {
  domains: Domain[];
  category: ReportingCategory;
  beginDate: Dayjs | null;
  endDate: Dayjs | null;
}

interface ReportingSharesStore {
  domains: Domain[];
  beginDate: Dayjs | null;
  endDate: Dayjs | null;
  top: number;
}

export const useReportingStore = defineStore('reportingStore', {
  state: (): ReportingStorageStore => ({
    domains: [],
    category: 'WHOLE_DOMAIN',
    beginDate: dayjs().subtract(7, 'days'),
    endDate: dayjs(),
  }),
});

export const useReportingSharesStore = defineStore('reportingSharesStore', {
  state: (): ReportingSharesStore => ({
    domains: [],
    beginDate: dayjs().subtract(1, 'days'),
    endDate: dayjs(),
    top: 50,
  }),
});
