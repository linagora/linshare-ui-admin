import Domain from '@/modules/domain/types/Domain';
import dayjs, { Dayjs } from 'dayjs';
import { defineStore } from 'pinia';

export type ReportingCategory = 'WHOLE_DOMAIN' | 'SHARED_SPACE' | 'MY_SPACE';

interface ReportingStore {
  domains: Domain[];
  category: ReportingCategory;
  beginDate: Dayjs | null;
  endDate: Dayjs | null;
}

export const useReportingStore = defineStore('reportingStore', {
  state: (): ReportingStore => ({
    domains: [],
    category: 'WHOLE_DOMAIN',
    beginDate: dayjs().subtract(7, 'days'),
    endDate: dayjs(),
  }),
});
