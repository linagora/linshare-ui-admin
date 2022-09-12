export type ResourceType =
  | 'SHARE_ENTRY'
  | 'DOCUMENT_ENTRY'
  | 'GUEST'
  | 'WORK_SPACE'
  | 'WORK_SPACE_MEMBER'
  | 'WORK_GROUP'
  | 'WORKGROUP_MEMBER'
  | 'WORKGROUP_FOLDER'
  | 'WORKGROUP_DOCUMENT'
  | 'WORKGROUP_DOCUMENT_REVISION'
  | 'DOMAIN'
  | 'USER'
  | 'DOMAIN_PATTERN'
  | 'GROUP_FILTER'
  | 'WORKSPACE_FILTER'
  | 'FUNCTIONALITY'
  | 'CONTACTS_LISTS'
  | 'CONTACTS_LISTS_CONTACTS'
  | 'UPLOAD_REQUEST_GROUP'
  | 'UPLOAD_REQUEST'
  | 'UPLOAD_REQUEST_URL'
  | 'UPLOAD_REQUEST_ENTRY'
  | 'UPLOAD_PROPOSITION'
  | 'ANONYMOUS_SHARE_ENTRY'
  | 'AUTHENTICATION'
  | 'USER_PREFERENCE'
  | 'RESET_PASSWORD'
  | 'SAFE_DETAIL'
  | 'PUBLIC_KEY'
  | 'JWT_PERMANENT_TOKEN'
  | 'SHARED_SPACE_NODE'
  | 'MAIL_ATTACHMENT'
  | 'SHARED_SPACE_MEMBER'
  | 'DRIVE_MEMBER'
  | 'DRIVE'
  | 'WORKGROUP'
  | 'GUEST_MODERATOR';

export type GenericActions = 'CREATE' | 'UPDATE' | 'DELETE' | 'GET' | 'DOWNLOAD' | 'SUCCESS' | 'FAILURE' | 'PURGE';

export type GenericResourceStatistic = { resource: string } & Record<GenericActions, number>;

export type GenericStatisticByResource = Record<string, Record<GenericActions, number>>;

export interface GenericStatistic {
  uuid?: string;
  value: number;
  domainUuid?: string;
  parentDomainUuid?: string;
  action: GenericActions;
  creationDate: number;
  statisticDate: string;
  resourceType: ResourceType;
  type: 'ONESHOT' | 'DAILY';
}
