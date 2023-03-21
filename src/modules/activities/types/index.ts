import Domain from '@/modules/domain/types/Domain';
import User from '@/modules/user/types/User';

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
    | 'GUEST_MODERATOR';
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
  };
}

export interface ActivityLogData extends ActivityLog {
  number: number;
  domainName: string;
  actorName: string;
  authorName: string;
  actionName: string;
  resourceTypeName: string;
  resourceName: string;
  dateTime: number;
  detail: string;
}
