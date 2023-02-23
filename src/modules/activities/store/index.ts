import Domain from '@/modules/domain/types/Domain';
import dayjs, { Dayjs } from 'dayjs';
import { defineStore } from 'pinia';

export type ActivitiesCategory = 'WHOLE_DOMAIN' | 'SHARED_SPACE' | 'MY_SPACE';

interface ActivitiesStore {
  domains: Domain[];
  category: ActivitiesCategory;
  beginDate: Dayjs | null;
  endDate: Dayjs | null;
}

export const useActivitiesStore = defineStore('activitiesStore', {
  state: (): ActivitiesStore => ({
    domains: [],
    category: 'WHOLE_DOMAIN',
    beginDate: dayjs().subtract(7, 'days'),
    endDate: dayjs(),
  }),
});
