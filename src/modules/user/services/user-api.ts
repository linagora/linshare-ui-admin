import { AxiosRequestConfig } from 'axios';
import api from '@/api';
import User from '@/modules/user/types/User';
import UserQuota from '@/modules/user/types/UserQuota';
import RestrictedContact from '@/modules/user/types/RestrictedContact';

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

export interface ListUserFilters {
  domain?: string;
  firstName?: string;
  lastName?: string;
  mail?: string;
  role?: string;
  type?: string;
  restricted?: boolean;
  canCreateGuest?: boolean;
  canUpload?: boolean;
}

export interface UsersList {
  data: User[];
  total: number;
  current: number;
}

async function listUsers (options: ListUsersOptions = {}): Promise<UsersList> {
  return await api.get('users', {
    params: options,
    transformResponse: (data, headers): UsersList => ({
      data: JSON.parse(data),
      total: Number(headers ? headers['total-elements'] : 0),
      current: Number(headers ? headers['current-page'] : 0)
    })
  });
}

async function getUser (uuid: string): Promise<User> {
  return await api.get(`users/${uuid}`);
}

async function updateUser (payload: User): Promise<User> {
  return await api.put('users', payload);
}

async function deleteUser (payload: User): Promise<User> {
  return await api.delete(`users/${payload.uuid}`, { data: payload });
}

async function deleteUser2FAKey (id: string, secondFAId: string): Promise<User> {
  return await api.delete(`users/${id}/2fa/${secondFAId}`);
}

async function listRestrictedContacts (id: string, config?: AxiosRequestConfig): Promise<RestrictedContact[]> {
  return await api.get(`users/${id}/restricted_contacts`, config);
}

async function createRestrictedContact (id: string, payload: RestrictedContact): Promise<RestrictedContact> {
  return await api.post(`users/${id}/restricted_contacts`, payload);
}

async function removeRestrictedContact (id: string, restrictedContactId: string): Promise<void> {
  await api.delete(`users/${id}/restricted_contacts/${restrictedContactId}`);
}

async function getUserQuota (id: string, quotaId: string): Promise<UserQuota> {
  return await api.get(`users/${id}/quota/${quotaId}`);
}

async function updateUserQuota (id: string, quota: UserQuota): Promise<UserQuota> {
  return await api.put(`users/${id}/quota/${quota.uuid}`, quota);
}

export {
  listUsers,
  getUser,
  updateUser,
  deleteUser,
  deleteUser2FAKey,
  listRestrictedContacts,
  createRestrictedContact,
  removeRestrictedContact,
  getUserQuota,
  updateUserQuota
};
