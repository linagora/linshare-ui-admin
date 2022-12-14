export interface OIDCUserProvider {
  uuid: string;
  creationDate?: number;
  modificationDate?: number;
  type?: 'OIDC_PROVIDER';
  domainDiscriminator?: string;
  checkExternalUserID?: boolean;
  useAccessClaim?: boolean;
  useRoleClaim?: boolean;
  useEmailLocaleClaim?: boolean;
}

export interface LDAPUserProvider {
  uuid: string;
  creationDate?: number;
  modificationDate?: number;
  type?: 'LDAP_PROVIDER';
  ldapServer?: {
    uuid: string;
    name: string;
  };
  userFilter?: {
    uuid: string;
    name: string;
  };
  baseDn?: string;
}

export interface TwakeUserProvider {
  uuid: string;
  creationDate?: number;
  modificationDate?: number;
  type?: 'TWAKE_PROVIDER' | 'TWAKE_GUEST_PROVIDER';
  twakeServer: {
    uuid: string;
    name: string;
  };
  twakeCompanyId: string;
}

type UserProvider = OIDCUserProvider | LDAPUserProvider | TwakeUserProvider;

export const EMPTY_PROVIDER = {
  uuid: '',
};

export default UserProvider;
