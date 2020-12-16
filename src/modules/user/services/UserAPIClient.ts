import { AxiosRequestConfig } from 'axios';
import AdminAPIClient from '@/core/services/AdminAPIClient';
import User from '@/modules/user/type/User';

export interface FindUserPayload {
  firstName?: string;
  lastName?: string;
  mail?: string;
}

class UserAPIClient extends AdminAPIClient {
  constructor () {
    super('users');
  }

  async getUsers (payload: FindUserPayload, config?: AxiosRequestConfig): Promise<User[]> {
    return await this.transport.post('search', payload, config);
  };
}

export default new UserAPIClient();
