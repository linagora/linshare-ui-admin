import { AxiosError } from 'axios';

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
