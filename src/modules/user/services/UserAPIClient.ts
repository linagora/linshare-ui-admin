import { AxiosRequestConfig } from 'axios';
import AdminAPIClient from '@/core/services/AdminAPIClient';
import User from '@/modules/user/type/User';

export interface ListUsersOptions {
  domain?: string;
  firstName?: string;
  lastName?: string;
  mail?: string;
  role?: string;
  type?: string;
  sortOrder?: 'ASC' | 'DESC';
  sortField?: string;
  restricted?: boolean;
  canCreateGuest?: boolean;
  canUpload?: boolean;
  page?: number;
  size?: number;
}

export interface UsersList {
  data: User[];
  total: number;
  current: number;
}

class UserAPIClient extends AdminAPIClient {
  constructor () {
    super('users', {}, { responseDataOnly: false });
  }

  async listUsers (options: ListUsersOptions = {}): Promise<UsersList> {
    const { data, headers } = await this.transport.get('', {
      params: options
    });

    return {
      data,
      total: Number(headers ? headers['total-elements'] : 0),
      current: Number(headers ? headers['current-page'] : 0)
    };
  };

  async getUser (id: string, config?: AxiosRequestConfig): Promise<User> {
    return (await this.transport.get(id, config)).data;
  }

  async updateUser (payload: User): Promise<User> {
    return (await this.transport.put('', payload)).data;
  }

  async deleteUser (payload: User): Promise<User> {
    return (await this.transport.delete('', { data: payload })).data;
  }

  async remove2FAKey (id: string, secondFAId: string): Promise<User> {
    return (await this.transport.delete(`${id}/2fa/${secondFAId}`)).data;
  }
}

export default new UserAPIClient();
