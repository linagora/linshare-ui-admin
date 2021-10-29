import api from '@/api';
import RemoteServer from '@/modules/remote-server/types/RemoteServer';
import Domain from '@/modules/domain/types/Domain';

async function listRemoteServers (): Promise<RemoteServer[]> {
  return await api.get('remote_servers');
}

async function createRemoteServer (payload: Partial<RemoteServer>): Promise<RemoteServer> {
  return await api.post('remote_servers', payload);
}

async function updateRemoteServer (payload: Partial<RemoteServer>): Promise<RemoteServer> {
  if (!payload.uuid) {
    throw new Error('uuid of remote server required');
  }

  return await api.put(`remote_servers/${payload.uuid}`, payload);
}

async function getAssociatedDomains (uuid: string): Promise<Domain[]> {
  return await api.get(`remote_servers/${uuid}/domains`);
}

async function deleteRemoteServer (uuid: string) {
  return await api.delete(`remote_servers/${uuid}`);
}

export {
  listRemoteServers,
  createRemoteServer,
  updateRemoteServer,
  getAssociatedDomains,
  deleteRemoteServer
};
