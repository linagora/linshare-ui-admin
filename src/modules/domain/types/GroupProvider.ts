export interface LDAPGroupProvider {
  uuid?: string;
  creationDate?: number;
  modificationDate?: number;
  type?: 'LDAP_PROVIDER';
  ldapServer: {
    uuid: string;
    name: string;
  };
  groupFilter: {
    uuid: string;
    name: string;
  };
  baseDn: string;
  searchInOtherDomains: boolean;
}

export const EMPTY_PROVIDER: LDAPGroupProvider = {
  ldapServer: {
    uuid: '',
    name: '',
  },
  groupFilter: {
    uuid: '',
    name: '',
  },
  baseDn: '',
  searchInOtherDomains: false,
};
