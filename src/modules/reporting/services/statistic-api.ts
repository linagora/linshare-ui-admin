import api from '@/api';
import { SORT_ORDER } from '@/core/types/Sort';
import type { PaginatedList } from '@/core/types/PaginatedList';
import type { AccountQuotaStatistic } from '../types/AccountQuotaStatistic';
import type { GenericStatistic, GenericActions, ResourceType } from '../types/GenericStatistic';
import type {
  StorageConsumptionStatistic,
  StorageConsumtptionStatisticType,
} from '../types/StorageConsumptionStatistic';
import { MimeTypeStatistic } from '../types/MimeTypeStatistic';
import { TopSharesFileCount } from '../types/TopSharesFileCount';
import { TopSharesFileSize } from '../types/TopSharesFileSize';

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
  resourceType?: ResourceType | ResourceType[];
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

interface MimeTypeParameter {
  includeNestedDomains?: boolean;
  sortOrder?: SORT_ORDER;
  sortField?: 'creationDate' | 'mimeType' | 'value';
  greaterThanOrEqualTope?: number;
  lessThanOrEqualTo?: number;
  type?: 'DAILY';
  mimeType?: string;
  sum?: boolean;
  beginDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

interface TopSharesByFileCount {
  sortOrder?: SORT_ORDER;
  domainUuids?: object;
  beginDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

interface TopSharesByFileSize {
  sortOrder?: SORT_ORDER;
  domainUuids?: object;
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

async function getMimeTypeStatistics(
  domainUuid: string,
  params: MimeTypeParameter = {}
): Promise<PaginatedList<MimeTypeStatistic>> {
  return await api.get(`domains/${domainUuid}/statistics/mime_types`, { params });
}

async function getTopSharesByFileCount(params: TopSharesByFileCount = {}): Promise<TopSharesFileCount> {
  return await api.get(`shares/topSharesByFileCount`, { params });
}

async function getTopSharesByFileSize(params: TopSharesByFileSize = {}): Promise<TopSharesFileSize> {
  return await api.get(`shares/topSharesByFileSize`, { params });
}

export {
  getAccountQuotaStatistics,
  getGenericStatistics,
  getStorageConsumptionStatistics,
  getMimeTypeStatistics,
  getTopSharesByFileCount,
  getTopSharesByFileSize,
};
