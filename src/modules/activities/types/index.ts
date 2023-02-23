import Domain from '@/modules/domain/types/Domain';

export interface ActivityLog {
  type:
    | 'JWT_PERMANENT_TOKEN'
    | 'AUTHENTICATION'
    | 'WORK_SPACE'
    | 'WORK_SPACE_MEMBER'
    | 'WORK_GROUP'
    | 'WORKGROUP_MEMBER'
    | 'WORKSPACE_FILTER'
    | 'DOMAIN';
  uuid: string;
  authUser: {
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
  };
}
