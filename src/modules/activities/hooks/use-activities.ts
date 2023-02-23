import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { message } from 'ant-design-vue';
import { APIError } from '@/core/types/APIError';
import { ActivityLog } from '@/modules/activities/types';
import { useActivitiesStore } from '@/modules/activities/store';
import { getActivitiesLogs } from '@/modules/activities/services';

const loading = ref(false);
const activitiesLogs = ref<ActivityLog[]>([]);

export function useActivities() {
  // data
  const { beginDate, endDate } = storeToRefs(useActivitiesStore());

  //methods
  async function fetchActivities() {
    try {
      loading.value = true;
      const data = await getActivitiesLogs(beginDate.value?.toISOString(), endDate.value?.toISOString());
      activitiesLogs.value = data;
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      } else {
        console.error(error);
      }
    } finally {
      loading.value = false;
    }
  }

  return { activitiesLogs, fetchActivities, loading };
}
