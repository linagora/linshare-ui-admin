export interface LDAPWorkspaceProvider {
  uuid?: string;
  creationDate?: number;
  modificationDate?: number;
  type?: 'LDAP_PROVIDER';
  ldapServer: {
    uuid: string;
    name: string;
  };
  driveFilter: {
    uuid: string;
    name: string;
  };
  baseDn: string;
  searchInOtherDomains: boolean;
}

export const EMPTY_PROVIDER: LDAPWorkspaceProvider = {
  ldapServer: {
    uuid: '',
    name: '',
  },
  driveFilter: {
    uuid: '',
    name: '',
  },
  baseDn: '',
  searchInOtherDomains: false,
};
