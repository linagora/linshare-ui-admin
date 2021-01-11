import { AxiosRequestConfig, AxiosError } from 'axios';
import AdminAPIClient from '@/core/services/AdminAPIClient';
import User from '@/modules/user/type/User';
import SecondFactorAuthentication from '@/modules/auth/type/SecondFactorAuthentication';

export interface AuthError extends AxiosError {
  code: string;
  message: string;
}

export class AuthError extends Error {
  constructor (error: AxiosError) {
    super();
    this.code = error?.response?.headers['x-linshare-auth-error-code'];

    switch (this.code) {
      case '1000':
        this.message = 'ERRORS.COMMON_MESSAGE';
        break;
      case '1001':
        this.message = 'ERRORS.INVALID_LOGIN_CREDENTIALS';
        break;
      case '1002':
        this.message = 'ERRORS.OTP_REQUIRED';
        break;
      case '1003':
        this.message = 'ERRORS.OTP_ERROR';
        break;
      case '1004':
        this.message = 'ERRORS.ACCOUNT_LOCKED';
        break;
      default:
        this.message = 'ERRORS.UNEXPECTED_ERROR';
    }
  }

  isCommonError () {
    return this.code === '1000';
  }

  isOTPRequiredError () {
    return this.code === '1002';
  }
}
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
  };

  async logOut (config?: AxiosRequestConfig): Promise<null> {
    return await this.transport.get('logout', config);
  };

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
