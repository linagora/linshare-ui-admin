export interface LDAPWorkspaceProvider {
  uuid?: string;
  creationDate?: number;
  modificationDate?: number;
  type?: 'LDAP_PROVIDER';
  ldapServer: {
    uuid: string;
    name: string;
  };
  workSpaceFilter: {
    uuid: string;
    name: string;
  };
  baseDn: string
  searchInOtherDomains: boolean;
}

export const EMPTY_PROVIDER: LDAPWorkspaceProvider = {
  ldapServer: {
    uuid: '',
    name: ''
  },
  workSpaceFilter: {
    uuid: '',
    name: ''
  },
  baseDn: '',
  searchInOtherDomains: false
};
