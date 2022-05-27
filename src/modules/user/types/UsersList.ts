import Filters from '@/core/types/Filters';
import { SORT_ORDER } from '@/core/types/Sort';
import User from './User';

export interface UsersListFilters extends Filters {
  domain?: string;
  firstName?: string;
  lastName?: string;
  mail?: string;
  role?: string;
  type?: string;
  restricted?: boolean;
  canCreateGuest?: boolean;
  canUpload?: boolean;
}

export interface UsersList {
  data: User[];
  total: number;
  current: number;
}

export interface UsersListParameters {
  domain?: string;
  firstName?: string;
  lastName?: string;
  mail?: string;
  role?: string;
  type?: string;
  restricted?: boolean;
  canCreateGuest?: boolean;
  canUpload?: boolean;
  page?: number;
  size?: number;
  sortOrder?: SORT_ORDER;
  sortField?: string;
}
