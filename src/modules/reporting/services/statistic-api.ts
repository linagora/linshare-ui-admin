import api from '@/api';
import { PaginatedList } from '@/core/types/PaginatedList';
import { SORT_ORDER } from '@/core/types/Sort';
import type { AccountQuotaStatistic } from '../types/AccountQuotaStatistic';
import type { GenericStatistic, GenericActions } from '../types/GenericStatistic';
import type {
  StorageConsumptionStatistic,
  StorageConsumtptionStatisticType,
} from '../types/StorageConsumptionStatistic';

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

interface StorageConsumptionParameters {
  includeNestedDomains?: boolean;
  sortOrder?: SORT_ORDER;
  sortField?: 'creationDate' | 'statisticDate';
  type?: StorageConsumtptionStatisticType;
  beginDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

interface AccountQuotaParameters {
  includeNestedDomains?: boolean;
  sortOrder?: SORT_ORDER;
  sortField?:
    | 'quota'
    | 'usedSpace'
    | 'yesterdayUsedSpace'
    | 'maxFileSize'
    | 'domain'
    | 'parentDomain'
    | 'maintenance'
    | 'creationDate'
    | 'modificationDate'
    | 'batchModificationDate'
    | 'maxFileSizeOverride'
    | 'quotaOverride';
  greaterThanOrEqualTope?: number;
  lessThanOrEqualTo?: number;
  type?: 'USER' | 'WORK_GROUP';
  beginDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

async function getGenericStatistics(
  domainUuid: string,
  params: GenericStatisticParameters = {}
): Promise<PaginatedList<GenericStatistic>> {
  return await api.get(`domains/${domainUuid}/statistics/generics`, { params });
}

async function getStorageConsumptionStatistics(
  domainUuid: string,
  params: StorageConsumptionParameters = {}
): Promise<PaginatedList<StorageConsumptionStatistic>> {
  return await api.get(`domains/${domainUuid}/statistics/storage_consumptions`, { params });
}

async function getAccountQuotaStatistics(
  domainUuid: string,
  params: AccountQuotaParameters = {}
): Promise<PaginatedList<AccountQuotaStatistic>> {
  return await api.get(`domains/${domainUuid}/statistics/account_quotas`, { params });
}

export { getAccountQuotaStatistics, getGenericStatistics, getStorageConsumptionStatistics };
