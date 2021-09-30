export enum ACCOUNT_ROLE {
  SIMPLE = 'SIMPLE',
  ADMIN = 'ADMIN',
  SYSTEM = 'SYSTEM',
  SUPERADMIN = 'SUPERADMIN',
  DELEGATION = 'DELEGATION',
  UPLOAD_REQUEST = 'UPLOAD_REQUEST',
  SAFE = 'SAFE',
  ANONYMOUS = 'ANONYMOUS'
}

export default interface User {
  uuid: string;
  mail: string;
  firstName: string;
  lastName: string;
  canUpload: boolean;
  canCreateGuest: boolean;
  externalMailLocale: string;
  creationDate: number;
  modificationDate: number;
  expirationDate: number;
  secondFAUuid: string;
  secondFAEnabled: boolean;
  quotaUuid: string;
  author: {
    uuid: string;
    email: string;
    name: string;
  };
  domain: {
    name: string;
    uuid: string;
  };
  accountType: 'INTERNAL' | 'GUEST' | 'TECHNICAL_ACCOUNT' | 'THREAD' | 'ROOT' | 'SYSTEM';
  role: ACCOUNT_ROLE;
}
