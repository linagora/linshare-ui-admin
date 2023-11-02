import { ref, reactive, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { message } from 'ant-design-vue';
import Domain from '@/core/types/Domain';
import { APIError } from '@/core/types/APIError';
import { ActivityLog, ActivityLogData, ActivityLogParameters, SORT_FIELD } from '@/modules/activities/types';
import { useActivitiesStore } from '@/modules/activities/store';
import { getActivitiesLogs } from '@/modules/activities/services';
import { getDomains } from '@/modules/domain/services/domain-api';
import { useI18n } from 'vue-i18n';
import { DEFAULT_PAGE_SIZE } from '@/core/constants/pagination';
import { useAuthStore } from '@/modules/auth/store';
import { useDomainStore } from '@/modules/domain/store';
import Sort, { SORT_ORDER } from '@/core/types/Sort';

const loading = ref(false);
const activitiesLogs = ref<ActivityLog[]>([]);
const domainList = ref<Domain[]>([]);
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: DEFAULT_PAGE_SIZE,
});
const { currentDomain } = storeToRefs(useDomainStore());
const domainUuid = currentDomain.value.uuid;

export function useActivities() {
  const { t } = useI18n();

  // data
  const { beginDate, endDate, action, type, domain, actor, resourceName } = storeToRefs(useActivitiesStore());
  const { loggedUser } = storeToRefs(useAuthStore());
  // computed
  const activitiesLogsFormated = computed(() => {
    const formatedData = activitiesLogs.value
      .sort((a: ActivityLogData, b: ActivityLogData) => b.creationDate - a.creationDate)
      ?.map((item, index) => {
        return {
          ...item,
          number: (pagination.current - 1) * pagination.pageSize + index + 1,
          domainName: item?.actor?.domain?.label ?? item?.domain?.label ?? item?.resource?.domain?.label ?? '-',
          actorName:
            loggedUser.value?.uuid === item?.actor?.uuid ||
            (loggedUser.value?.uuid === item?.authUser?.uuid && !item?.actor?.uuid)
              ? t('ACTIVITIES.ME')
              : item?.actor?.name ?? item?.authUser?.name,
          actorId: item?.actor?.uuid,
          actionName: t(`ACTIVITIES.FILTERS_SELECT.ACTION.${item?.action}`),
          resourceTypeName: t(`ACTIVITIES.FILTERS_SELECT.TYPE.${item?.type}`),
          resourceName: _getResourceName(item),
          dateTime: item?.creationDate,
          authorName: item?.authUser?.name,
          authorId: item?.authUser?.uuid,
          detail: item?.message,
          resourceSize: item?.resource?.size || 0,
          resourceRecipientName:
            loggedUser.value?.uuid === item?.resource?.recipient?.uuid
              ? t('ACTIVITIES.ME')
              : item?.resource?.recipient?.name || item?.recipientMail || '',
        } as ActivityLogData;
      });
    const activities = _filterByActors(formatedData);
    return _filterByResourceNames(activities);
  });

  //methods
  async function fetchActivities(options: ActivityLogParameters) {
    try {
      loading.value = true;

      const { data, total, current } = await getActivitiesLogs(
        options.domainUuid,
        options.beginDate,
        options.endDate,
        options.action,
        options.type,
        options.domain,
        options.size,
        options.page,
        options.sortField,
        options.sortOrder
      );
      activitiesLogs.value = data;
      pagination.total = total;
      pagination.current = current + 1;
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

  function _filterByActors(logs: ActivityLogData[]) {
    const filtedActors = logs.filter((item) => {
      return actor.value?.length
        ? actor.value?.includes(item?.actorName) ||
            actor.value?.some((actor) => {
              return item?.actorName?.toLowerCase().includes(actor.toLowerCase());
            })
        : true;
    });

    return filtedActors;
  }

  function _filterByResourceNames(logs: ActivityLogData[]) {
    const filtedNames = logs.filter((item) => {
      return resourceName.value?.length
        ? resourceName.value?.includes(item?.resourceName) ||
            resourceName.value?.some((name) => {
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
    } else if (activity?.type === 'FUNCTIONALITY') {
      return t(`FUNCTIONALITIES.DETAILS.${activity?.resourceUuid}.NAME`);
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

  async function handleTableChange(resetPagination: boolean) {
    const parameters: ActivityLogParameters = {};

    parameters.size = pagination.pageSize;
    parameters.page = resetPagination ? 0 : pagination.current - 1;
    parameters.domainUuid = domainUuid;
    parameters.beginDate = beginDate.value?.format('YYYY-MM-DD');
    parameters.endDate = endDate.value?.format('YYYY-MM-DD');
    parameters.action = action.value.join('&action=');
    parameters.type = type.value.join('&type=');
    parameters.domain = domain.value.join('&domain=');
    parameters.actor = actor.value.join('&domain=');
    parameters.resourceName = resourceName.value.join('&domain=');
    parameters.sortField = SORT_FIELD.CREATIONDATE;
    parameters.sortOrder = SORT_ORDER.DESC;

    await fetchActivities(parameters);
  }

  return {
    activitiesLogs,
    activitiesLogsFormated,
    domainList,
    fetchActivities,
    fetchDomains,
    loading,
    pagination,
    handleTableChange,
  };
}
