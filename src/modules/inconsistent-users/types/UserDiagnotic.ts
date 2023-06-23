import Filters from '@/core/types/Filters';

export interface UserDiagnostic {
  uuid: string;
  label: string;
  identifier: string;
  ldap: boolean;
  database: boolean;
  guest: boolean;
  userMail: string;
  domainType: string;
}

export interface UserDiagnosticFilters extends Filters {
  email?: string;
}

export interface UsersDiagnosticDetail {
  uuid: string;
  creationDate: number;
  modificationDate: number;
  locale: string;
  externalMailLocale: string;
  domain: string;
  domainName: string;
  secondFAUuid: boolean;
  secondFAEnabled: boolean;
  secondFARequired: boolean;
  locked: boolean;
  firstName: string;
  lastName: string;
  mail: string;
  role: string;
  canUpload: boolean;
  canCreateGuest: boolean;
  accountType: string;
  quotaUuid: string;
}
