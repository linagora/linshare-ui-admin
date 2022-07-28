import { SORT_ORDER } from '@/core/types/Sort';
import Filters from '@/core/types/Filters';

export interface GuestListFilters extends Filters {
  firstName?: string;
  pattern?: string;
  role?: string;
}

export interface GuestListParameters {
  uuid?: string;
  pattern?: string;
  role?: string;
  page?: number;
  size?: number;
  sortOrder?: SORT_ORDER;
  sortField?: string;
}

export interface Guest {
  canUpload: boolean;
  comment: string;
  creationDate: number;
  domain: string;
  expirationDate: number;
  externalMailLocale: string;
  firstName: string;
  lastName: string;
  locale: string;
  mail: string;
  modificationDate: number;
  restricted: boolean;
  uuid: string;
}
