import { AxiosRequestConfig } from 'axios';
import api from '@/api';
import SecondFactorAuthentication from '../types/SecondFactorAuthentication';
import User from '@/modules/user/types/User';

async function getAuthorizedUser(config?: AxiosRequestConfig): Promise<User> {
  return await api.get('authentication/authorized', config);
}

async function get2FAStatus(uuid: string): Promise<SecondFactorAuthentication> {
  return await api.get(`authentication/2fa/${uuid}`);
}

async function create2FAKey(): Promise<SecondFactorAuthentication> {
  return await api.post('authentication/2fa');
}

async function logOut(): Promise<null> {
  return await api.get('authentication/logout');
}

async function remove2FAKey(uuid: string): Promise<SecondFactorAuthentication> {
  return await api.delete(`authentication/2fa/${uuid}`);
}

export { create2FAKey, get2FAStatus, getAuthorizedUser, logOut, remove2FAKey };
