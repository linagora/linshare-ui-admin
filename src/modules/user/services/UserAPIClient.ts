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

  async getUser (id: string, config?: AxiosRequestConfig): Promise<User> {
    return await this.transport.get(id, config);
  }

  async updateUser (payload: User): Promise<User> {
    return await this.transport.put('', payload);
  }

  async deleteUser (payload: User): Promise<User> {
    return await this.transport.delete('', { data: payload });
  }

  async remove2FAKey (id: string, secondFAId: string): Promise<User> {
    return await this.transport.delete(`${id}/2fa/${secondFAId}`);
  }
}

export default new UserAPIClient();
