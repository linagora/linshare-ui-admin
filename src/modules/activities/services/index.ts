import api from '@/api';
import type { PaginatedList } from '@/core/types/PaginatedList';
import { ActivityLogParameters } from '@/modules/activities/types';

async function getActivitiesLogs(
  domainUuid: string,
  includeNestedDomains: boolean,
  beginDate: string | undefined,
  endDate: string | undefined,
  action?: string,
  type?: string,
  domain?: string,
  size?: number,
  page?: number,
  sortField?: string,
  sortOrder?: string,
  actorEmail?: string,
  resourceName?: string
): Promise<PaginatedList<ActivityLogParameters>> {
  const queryUrl = `domains/${domainUuid}/audit`;

  return await api.get(queryUrl, {
    params: {
      includeNestedDomains,
      beginDate,
      endDate,
      action,
      type,
      domain,
      size,
      page,
      sortField,
      sortOrder,
      actorEmail,
      resourceName,
    },
  });
}

export { getActivitiesLogs };
