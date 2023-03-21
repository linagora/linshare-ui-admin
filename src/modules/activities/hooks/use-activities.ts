import { ref, reactive, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { message } from 'ant-design-vue';
import Domain from '@/core/types/Domain';
import { APIError } from '@/core/types/APIError';
import { ActivityLog, ActivityLogData } from '@/modules/activities/types';
import { useActivitiesStore } from '@/modules/activities/store';
import { getActivitiesLogs } from '@/modules/activities/services';
import { getDomains } from '@/modules/domain/services/domain-api';
import { useI18n } from 'vue-i18n';
import { DEFAULT_PAGE_SIZE } from '@/core/constants/pagination';
import { useAuthStore } from '@/modules/auth/store';

const loading = ref(false);
const activitiesLogs = ref<ActivityLog[]>([]);
const domainList = ref<Domain[]>([]);
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: DEFAULT_PAGE_SIZE,
});

export function useActivities() {
  const { t } = useI18n();

  // data
  const { beginDate, endDate, actions, types, domains, actors, resourceNames } = storeToRefs(useActivitiesStore());
  const { loggedUser } = storeToRefs(useAuthStore());
  // computed
  const filteredListByPage = computed(() => {
    const firstIndex = (pagination.current - 1) * pagination.pageSize;
    const lastIndex = pagination.current * pagination.pageSize;
    return activitiesLogsFormated.value.slice(firstIndex, lastIndex);
  });

  const activitiesLogsFormated = computed(() => {
    const formatedData = activitiesLogs.value
      .map((item, index) => {
        return {
          ...item,
          number: index + 1,
          domainName: item?.actor?.domain?.label ?? item?.domain?.label ?? '-',
          actorName: loggedUser.value?.uuid === item?.actor?.uuid ? t('ACTIVITIES.ME') : item?.actor?.name,
          actionName: t(`ACTIVITIES.FILTERS_SELECT.ACTION.${item?.action}`),
          resourceTypeName: t(`ACTIVITIES.FILTERS_SELECT.TYPE.${item?.type}`),
          resourceName: _getResourceName(item),
          dateTime: item?.creationDate,
          authorName: item?.authUser?.name,
          detail: item?.message,
        } as ActivityLogData;
      })
      .sort((a: ActivityLogData, b: ActivityLogData) => b.dateTime - a.dateTime);

    let activities = _filterByActors(formatedData);
    activities = _filterByResourceNames(activities);
    return _filterByDomains(activities);
  });

  const loggedUserId = computed(() => {
    return loggedUser.value?.uuid;
  });

  //methods
  async function fetchActivities() {
    try {
      loading.value = true;
      const data: ActivityLog[] = await getActivitiesLogs(
        beginDate.value?.toISOString(),
        endDate.value?.toISOString(),
        actions.value.join('&action='),
        types.value.join('&type=')
      );
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

  function _filterByDomains(logs: ActivityLogData[]) {
    const filtedDomains = logs.filter((item) => {
      return domains.value?.length
        ? domains.value?.includes(item?.domainName) ||
            domains.value?.some((domain) => {
              return item?.domainName?.toLowerCase().includes(domain.toLowerCase());
            })
        : true;
    });

    return filtedDomains;
  }

  function _filterByActors(logs: ActivityLogData[]) {
    const filtedActors = logs.filter((item) => {
      return actors.value?.length
        ? actors.value?.includes(item?.actorName) ||
            actors.value?.some((actor) => {
              return item?.actorName?.toLowerCase().includes(actor.toLowerCase());
            })
        : true;
    });

    return filtedActors;
  }

  function _filterByResourceNames(logs: ActivityLogData[]) {
    const filtedNames = logs.filter((item) => {
      return resourceNames.value?.length
        ? resourceNames.value?.includes(item?.resourceName) ||
            resourceNames.value?.some((name) => {
              return item?.resourceName?.toLowerCase().includes(name.toLowerCase());
            })
        : true;
    });

    return filtedNames;
  }

  async function fetchDomains() {
    const response = await getDomains({ params: { tree: false } });
    domainList.value = response as Domain[];
  }

  function _getResourceName(activity: ActivityLog) {
    if (activity?.type === 'GUEST_MODERATOR') {
      return activity?.resource?.guest?.name;
    }
    switch (activity?.resourceUuid) {
      case loggedUser.value?.uuid:
        return t('ACTIVITIES.ME');
      case activity.actor?.uuid:
        return activity.actor.name;
      case activity.domain?.uuid:
        return activity.domain?.label;
      default:
        return activity.resource?.name;
    }
  }

  watch(activitiesLogsFormated, async (newVal) => {
    pagination.total = newVal.length;
  });

  return {
    activitiesLogs,
    activitiesLogsFormated,
    domainList,
    fetchActivities,
    fetchDomains,
    loading,
    pagination,
    filteredListByPage,
  };
}
