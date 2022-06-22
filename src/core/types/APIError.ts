import type { AxiosResponse, AxiosError } from 'axios';
import i18n from '../plugins/i18n';
import { ERRORS_REQUIRE_EXTRA_MESSAGE } from '@/core/constants';

export type LinShareAPIError = AxiosError<{
  errCode: number;
  message: string;
}>;

export class APIError extends Error {
  public isAuthError: boolean;
  public errorCode: number;
  public response?: AxiosResponse;

  constructor(error: LinShareAPIError) {
    super();

    this.isAuthError = !!error.response?.headers['x-linshare-auth-error-code'];
    this.response = error.response;

    if (error.response?.headers['x-linshare-auth-error-code']) {
      this.errorCode = +error.response?.headers['x-linshare-auth-error-code'];
      this.message = error.response?.headers['x-linshare-auth-error-msg'] || i18n.global.t('ERRORS.UNKNOWN');
    } else if (error.response?.data) {
      this.errorCode = +error.response.data.errCode;
      this.message = error.response?.data.message;
    } else {
      this.errorCode = NaN;
    }
  }

  getMessage(): string {
    if (ERRORS_REQUIRE_EXTRA_MESSAGE.includes(this.errorCode)) {
      return i18n.global.t(this.isAuthError ? `ERRORS.AUTH.${this.errorCode}` : `ERRORS.${this.errorCode}`, {
        message: this.message,
      });
    }
    return i18n.global.t(this.isAuthError ? `ERRORS.AUTH.${this.errorCode}` : `ERRORS.${this.errorCode}`, 1, {
      missingWarn: true,
      default: this.message,
    });
  }

  isUnauthorizedError(): boolean {
    return this.isAuthError && this.errorCode === 1000;
  }

  isOTPMissingError(): boolean {
    return this.isAuthError && this.errorCode === 1002;
  }
}
