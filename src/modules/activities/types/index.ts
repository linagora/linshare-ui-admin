import Domain from '@/modules/domain/types/Domain';
import User from '@/modules/user/types/User';
import { SORT_ORDER } from '@/core/types/Sort';
// import { DEFAULT_PAGE_SIZE } from '@/core/constants/pagination';
import dayjs, { Dayjs } from 'dayjs';
import { ActivitiesType, ActivitiesAction } from '@/modules/activities/store';

export interface ActivityLog {
  type:
    | 'JWT_PERMANENT_TOKEN'
    | 'AUTHENTICATION'
    | 'WORK_SPACE'
    | 'WORK_SPACE_MEMBER'
    | 'WORK_GROUP'
    | 'WORKGROUP_MEMBER'
    | 'WORKSPACE_FILTER'
    | 'DOMAIN'
    | 'GUEST_MODERATOR'
    | 'FUNCTIONALITY';
  uuid: string;
  authUser: User;
  resourceUuid: string;
  action: string;
  creationDate: string | number | Date;
  actor: {
    firstName: string;
    lastName: string;
    name: string;
    mail: string;
    uuid: string;
    role: 'SUPERADMIN' | 'ADMIN' | 'GUEST';
    accountType: 'ROOT';
    domain: {
      uuid: string;
      label: string;
    };
  };
  message: string;
  domain?: {
    uuid: string;
    label: string;
  };
  resource?: {
    uuid: string;
    label: string;
    name: string;
    guest?: User;
    account?: User;
    size?: number;
    type?: string;
    sha256Sum?: string;
    shareUuid?: string;
    resourceUuid?: string;
    creationDate?: string | number | Date;
    downloaded?: number;
    expirationDate?: string | number | Date;
    humanMimeType?: string;
    modificationDate?: string | number | Date;
    recipient?: {
      firstName: string;
      lastName: string;
      name: string;
      mail: string;
      uuid: string;
      role: 'SUPERADMIN' | 'ADMIN' | 'GUEST';
      accountType: 'ROOT';
      domain: {
        uuid: string;
        label: string;
      };
    };
    node?: {
      name: string;
      mail: string;
      uuid: string;
      parentUuid: string;
      creationDate?: string | number | Date;
      modificationDate?: string | number | Date;
      nodeType: string;
      domainUuid: string;
    };
    sender?: {
      firstName: string;
      lastName: string;
      name: string;
      mail: string;
      uuid: string;
      role: 'SUPERADMIN' | 'ADMIN' | 'GUEST';
      accountType: 'ROOT';
      domain: {
        uuid: string;
        label: string;
      };
    };
    domain?: {
      uuid: string;
      label: string;
    };
  };
  recipientMail?: string;
}

export interface ActivityLogData extends ActivityLog {
  number: number;
  domainName: string;
  actorName: string;
  authorName: string;
  actionName: string;
  resourceTypeName: string;
  resourceName: string;
  resourceSize: number;
  resourceRecipientName: string;
  dateTime: number;
  detail: string;
}

export interface ActivityLogParameters {
  action: string;
  type: string;
  beginDate: string | undefined;
  endDate: string | undefined;
  domain: string;
  actorEmail: string;
  resourceName: string;
  size: number;
  page: number;
  sortOrder?: SORT_ORDER;
  sortField?: SORT_FIELD.CREATIONDATE;
  domainUuid: string;
}

export enum SORT_FIELD {
  CREATIONDATE = 'creationDate',
}
