import api from '@/api';
import { PaginatedList } from '@/core/types/PaginatedList';
import { SORT_ORDER } from '@/core/types/Sort';
import { GenericStatistic, GenericActions } from '../types/GenericStatistic';

type SumableField = 'action' | 'statisticDate' | 'resourceType';

interface GenericStatisticParameters {
  includeNestedDomains?: boolean;
  sortOrder?: SORT_ORDER;
  sortField?:
    | 'domainUuid'
    | 'parentDomainUuid'
    | 'action'
    | 'creationDate'
    | 'statisticDate'
    | 'resourceType'
    | 'type'
    | 'value';
  type?: 'ONESHOT' | 'DAILY';
  action?: GenericActions;
  resourceType?: string;
  resourceGroup?:
    | 'ACCOUNTS'
    | 'ADMINISTRATION'
    | 'CONTACT_LISTS'
    | 'GUESTS'
    | 'MY_SPACE'
    | 'UPLOAD_REQUESTS'
    | 'SHARED_SPACES';
  sum?: boolean;
  sumBy?: SumableField | SumableField[];
  beginDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

async function getGenericStatistics(
  domainUuid: string,
  options: GenericStatisticParameters = {}
): Promise<PaginatedList<GenericStatistic>> {
  return await api.get(`domains/${domainUuid}/statistics/generics`, { params: options });
}

export { getGenericStatistics };
