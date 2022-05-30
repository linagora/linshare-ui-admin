import { SORT_ORDER } from '@/core/types/Sort';
import Filters from '@/core/types/Filters';

export interface SharedSpaceListFilters extends Filters {
  name?: string;
  account?: string;
  nodeType?: string;
  domains?: string;
}

export interface SharedSpaceListParameters {
  name?: string;
  account?: string;
  nodeType?: string;
  domains?: string;
  page?: number;
  size?: number;
  sortOrder?: SORT_ORDER;
  sortField?: string;
}
