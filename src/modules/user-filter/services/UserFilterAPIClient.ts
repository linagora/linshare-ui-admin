import AdminAPIClient from '@/core/services/AdminAPIClient';
import Domain from '@/modules/domain/type/Domain';
import UserFilter from '../types/UserFilter';

class UserFilterAPIClient extends AdminAPIClient {
  constructor () {
    super('user_filters');
  }

  async listUserFilters (listModel?: boolean): Promise<UserFilter[]> {
    return await this.transport.get('', {
      params: {
        model: listModel
      }
    });
  }

  async createUserFilter (filter: Partial<UserFilter>): Promise<UserFilter> {
    return await this.transport.post('', filter);
  }

  async updateUserFilter (uuid: string, filter: Partial<UserFilter>): Promise<UserFilter> {
    return await this.transport.put(uuid, filter);
  }

  async getUserFilter (uuid: string): Promise<UserFilter> {
    return await this.transport.get(uuid);
  }

  async getAssociatedDomains (uuid: string): Promise<Domain[]> {
    return await this.transport.get(`${uuid}/domains`);
  }

  async deleteUserFilter (uuid: string): Promise<UserFilter> {
    return await this.transport.delete(uuid);
  }
}

export default new UserFilterAPIClient();
