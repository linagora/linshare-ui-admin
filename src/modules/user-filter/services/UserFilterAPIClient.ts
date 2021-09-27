import { AxiosRequestConfig } from 'axios';
import AdminAPIClient from '@/core/services/AdminAPIClient';
import UserFilter from '../types/UserFilter';

class UserFilterAPIClient extends AdminAPIClient {
  constructor () {
    super('user_filters');
  }

  async listUserFilters (config?: AxiosRequestConfig): Promise<UserFilter[]> {
    return await this.transport.get('', config);
  }
}

export default new UserFilterAPIClient();
