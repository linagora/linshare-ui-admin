export interface LDAPRemoteServer {
  uuid: string;
  name: string;
  url: string;
  creationDate?: number;
  modificationDate?: number;
  bindDn?: string;
  bindPassword?: string;
  bindPasswordSet?: boolean;
  serverType: 'LDAP';
}

type RemoteServer = LDAPRemoteServer;
type RemoteServerWrite = Omit<LDAPRemoteServer, 'bindPasswordSet'>;

export const EMPTY_LDAP_SERVER: LDAPRemoteServer = {
  uuid: '',
  name: '',
  url: '',
  serverType: 'LDAP',
};

export type { RemoteServerWrite };
export default RemoteServer;
