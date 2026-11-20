import api from '@/api';
import RemoteServer, { RemoteServerWrite } from '../types/RemoteServer';
import Domain from '@/modules/domain/types/Domain';

function omitRemoteServerPassword(remoteServer: RemoteServer): RemoteServer {
  const { bindPassword, ...safeRemoteServer } = remoteServer;

  return {
    ...safeRemoteServer,
    bindPasswordSet: remoteServer.bindPasswordSet ?? Boolean(bindPassword),
  };
}

async function listRemoteServers(): Promise<RemoteServer[]> {
  const remoteServers: RemoteServer[] = await api.get('remote_servers');

  return remoteServers.map(omitRemoteServerPassword);
}

async function createRemoteServer(payload: Omit<RemoteServerWrite, 'uuid'>): Promise<RemoteServer> {
  const remoteServer: RemoteServer = await api.post('remote_servers', payload);

  return omitRemoteServerPassword(remoteServer);
}

async function updateRemoteServer(payload: RemoteServerWrite): Promise<RemoteServer> {
  const remoteServer: RemoteServer = await api.put(`remote_servers/${payload.uuid}`, payload);

  return omitRemoteServerPassword(remoteServer);
}

async function getAssociatedDomains(uuid: string): Promise<Domain[]> {
  return await api.get(`remote_servers/${uuid}/domains`);
}

async function deleteRemoteServer(uuid: string): Promise<void> {
  return await api.delete(`remote_servers/${uuid}`);
}

export { listRemoteServers, createRemoteServer, updateRemoteServer, getAssociatedDomains, deleteRemoteServer };
