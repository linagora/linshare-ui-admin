import SharedSpace, { SHARED_SPACE_TYPE } from './SharedSpace';
import SharedSpaceAccount from './SharedSpaceAccount';
import SharedSpaceRole from './SharedSpaceRole';
import { SORT_ORDER } from '@/core/types/Sort';
import Filters from '@/core/types/Filters';

export interface SharedSpaceMember {
  uuid: string;
  type?: SHARED_SPACE_TYPE;
  nested?: boolean;
  node: Partial<SharedSpace>;
  nestedRole?: Omit<SharedSpaceRole, 'enabled'>;
  role: Omit<SharedSpaceRole, 'enabled'>;
  account: SharedSpaceAccount;
  creationDate?: number;
  modificationDate?: number;
}

export interface SharedSpaceMembersListParameter {
  pattern?: string;
  type?: string;
  roles?: string;
  accountUuid?: string;
  page?: number;
  size?: number;
  sortOrder?: SORT_ORDER;
  sortField?: string;
}

export interface MemberListFilters extends Filters {
  pattern?: string;
  type?: string;
  role?: string;
  accountUuid?: string;
}

export const EMPTY_SHARED_SPACE_MEMBER: SharedSpaceMember = {
  uuid: '',
  node: {},
  role: {
    name: '',
    type: 'WORK_GROUP',
    uuid: '',
  },
  account: {
    firstName: '',
    lastName: '',
    mail: '',
    uuid: '',
  },
};
