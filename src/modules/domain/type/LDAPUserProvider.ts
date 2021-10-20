import Domain from './Domain';

export default interface LDAPUserProvider {
  uuid: string;
  creationDAte?: number;
  modificationDate?: number;
  domain?: Partial<Domain>;
  type?: 'LDAP_PROVIDER';
  ldapServer?: {
    uuid: string;
    name: string;
  }
  userFilter?: {
    uuid: string;
    name: string;
  }
  baseDn?: string;
}

export const EMPTY_PROVIDER: LDAPUserProvider = {
  uuid: ''
};
