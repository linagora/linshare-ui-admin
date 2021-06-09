import AdminAPIClient from '@/core/services/AdminAPIClient';
import SharedSpace from '@/modules/shared-spaces/type/SharedSpace';

export interface ListSharedSpaceOptions {
  account?: string;
  page?: number;
  size?: number;
}

export interface SharedSpacesList {
  data: SharedSpace[];
  total: number;
  current: number;
}

class SharedSpaceAPIClient extends AdminAPIClient {
  constructor () {
    super('shared_spaces', {}, { responseDataOnly: false });
  }

  async listSharedSpaces (options: ListSharedSpaceOptions = {}): Promise<SharedSpacesList> {
    const { data, headers } = await this.transport.get('', {
      params: options
    });

    return {
      data,
      total: Number(headers ? headers['total-elements'] : 0),
      current: Number(headers ? headers['current-page'] : 0)
    };
  };

  async getSharedSpace (id: string): Promise<SharedSpace> {
    return (await this.transport.get(id)).data;
  }
}

export default new SharedSpaceAPIClient();
