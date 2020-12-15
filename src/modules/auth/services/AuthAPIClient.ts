import { AxiosRequestConfig } from 'axios';
import AdminAPIClient from '@/core/services/AdminAPIClient';
import User from '@/modules/user/type/User';

class AuthAPIClient extends AdminAPIClient {
  constructor () {
    super('authentication');
  }

  async getAuthorizedUser (config?: AxiosRequestConfig): Promise<User> {
    return await this.transport.get('authorized', config);
  };

  async logOut (config?: AxiosRequestConfig): Promise<null> {
    return await this.transport.get('logout', config);
  };
}

export default new AuthAPIClient();
