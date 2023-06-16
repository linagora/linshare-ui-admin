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
  email: string;
}
