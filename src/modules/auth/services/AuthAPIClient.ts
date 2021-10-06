import { AxiosRequestConfig } from 'axios';
import AdminAPIClient from '@/core/services/AdminAPIClient';
import User from '@/modules/user/type/User';
import { AuthError } from '../type/AuthError';
import SecondFactorAuthentication from '@/modules/auth/type/SecondFactorAuthentication';

class AuthAPIClient extends AdminAPIClient {
  constructor () {
    super('authentication', {}, { useAuthInterceptor: false });
  }

  async getAuthorizedUser (config?: AxiosRequestConfig): Promise<User> {
    try {
      return await this.transport.get('authorized', config);
    } catch (error) {
      throw new AuthError(error);
    }
  }

  async logOut (): Promise<null> {
    return await this.transport.get('logout');
  }

  async get2FAStatus (uuid: string): Promise<SecondFactorAuthentication> {
    return await this.transport.get(`2fa/${uuid}`);
  }

  async create2FAKey (): Promise<SecondFactorAuthentication> {
    return await this.transport.post('2fa');
  }

  async remove2FAKey (uuid: string): Promise<SecondFactorAuthentication> {
    return await this.transport.delete(`2fa/${uuid}`);
  }
}

export default new AuthAPIClient();
