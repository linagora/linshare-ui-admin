import AdminAPIClient from '@/core/services/AdminAPIClient';
import RemoteServer from '@/modules/remote-server/types/RemoteServer';
import Domain from '@/modules/domain/type/Domain';

class RemoteServerAPIClient extends AdminAPIClient {
  constructor () {
    super('remote_servers');
  }

  async listRemoteServers (): Promise<RemoteServer[]> {
    return await this.transport.get('');
  }

  async createRemoteServer (payload: Partial<RemoteServer>): Promise<RemoteServer> {
    return await this.transport.post('', payload);
  }

  async updateRemoteServer (payload: Partial<RemoteServer>): Promise<RemoteServer> {
    if (!payload.uuid) {
      throw new Error('uuid of remote server required');
    }

    return await this.transport.put(payload.uuid, payload);
  }

  async getAssociatedDomains (uuid: string): Promise<Domain[]> {
    return await this.transport.get(`${uuid}/domains`);
  }
}

export default new RemoteServerAPIClient();
