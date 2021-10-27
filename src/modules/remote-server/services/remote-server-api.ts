import api from '@/api';
import RemoteServer from '@/modules/remote-server/types/RemoteServer';
import Domain from '@/modules/domain/type/Domain';

async function listRemoteServers (): Promise<RemoteServer[]> {
  return await api.get('');
}

async function createRemoteServer (payload: Partial<RemoteServer>): Promise<RemoteServer> {
  return await api.post('', payload);
}

async function updateRemoteServer (payload: Partial<RemoteServer>): Promise<RemoteServer> {
  if (!payload.uuid) {
    throw new Error('uuid of remote server required');
  }

  return await api.put(payload.uuid, payload);
}

async function getAssociatedDomains (uuid: string): Promise<Domain[]> {
  return await api.get(`${uuid}/domains`);
}

async function deleteRemoteServer (uuid: string) {
  return await api.delete(uuid);
}

export {
  listRemoteServers,
  createRemoteServer,
  updateRemoteServer,
  getAssociatedDomains,
  deleteRemoteServer
};
