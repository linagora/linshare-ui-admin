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

export interface TwakeRemoteServer {
  uuid: string;
  name: string;
  url: string;
  creationDate?: number;
  modificationDate?: number;
  clientId?: string;
  clientSecret?: string;
  serverType: 'TWAKE';
}

type RemoteServer = LDAPRemoteServer | TwakeRemoteServer;

export const EMPTY_LDAP_SERVER: LDAPRemoteServer = {
  uuid: '',
  name: '',
  url: '',
  serverType: 'LDAP',
};

export const EMPTY_TWAKE_SERVER: TwakeRemoteServer = {
  uuid: '',
  name: '',
  url: '',
  serverType: 'TWAKE',
};

export default RemoteServer;
