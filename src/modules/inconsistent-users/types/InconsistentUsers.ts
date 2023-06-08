import Filters from '@/core/types/Filters';
import { SORT_ORDER } from '@/core/types/Sort';
export interface InconsistentUsers {
  creationDate?: number;
  domain: string;
  domainName: string;
  externalMailLocale: string;
  locale: string;
  modificationDate: number;
  uuid: string;
  accountType: string;
  canCreateGuest: boolean;
  canUpload: boolean;
  firstName: string;
  lastName: string;
  mail: string;
  role: string;
}

export interface InconsistentUsersListFilters extends Filters {
  domains?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface InconsistentUsersListParameters {
  domainId?: string;
  firstName?: string;
  lastName?: string;
  mail?: string;
  page?: number;
  size?: number;
  sortOrder?: SORT_ORDER;
  sortField?: string;
}
