export interface LDAPRemoteServer {
  uuid: string;
  name: string;
  url: string;
  creationDate?: number;
  modificationDate?: number;
  bindDn?: string;
  bindPassword?: string;
  serverType: 'LDAP';
}

type RemoteServer = LDAPRemoteServer;

export const EMPTY_LDAP_SERVER: LDAPRemoteServer = {
  uuid: '',
  name: '',
  url: '',
  serverType: 'LDAP',
};

export default RemoteServer;
