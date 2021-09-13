export default interface RemoteServer {
  uuid: string;
  name: string;
  url: string;
  creationDate: number;
  modificationDate: number;
  bindDn: string;
  bindPassword: string;
  serverType: RemoteServerType;
}

export enum RemoteServerType {
  LDAP = 'LDAP'
}
