import { AxiosRequestConfig } from 'axios';
import api from '@/api';
import User from '../types/User';
import UserQuota from '../types/UserQuota';
import RestrictedContact from '../types/RestrictedContact';
import { UsersList, UsersListParameters } from '../types/UsersList';

async function listUsers(options: UsersListParameters = {}): Promise<UsersList> {
  return await api.get('users', {
    params: options,
    transformResponse: (data, headers): UsersList => ({
      data: JSON.parse(data),
      total: Number(headers ? headers['total-elements'] : 0),
      current: Number(headers ? headers['current-page'] : 0),
    }),
  });
}

async function getUser(uuid: string): Promise<User> {
  return await api.get(`users/${uuid}`);
}

async function updateUser(payload: User): Promise<User> {
  return await api.put(`users/${payload.uuid}`, payload);
}

async function deleteUser(payload: User): Promise<User> {
  return await api.delete(`users/${payload.uuid}`, { data: payload });
}

async function deleteUser2FAKey(id: string, secondFAId: string): Promise<User> {
  return await api.delete(`users/${id}/2fa/${secondFAId}`);
}

async function listRestrictedContacts(id: string, config?: AxiosRequestConfig): Promise<RestrictedContact[]> {
  return await api.get(`users/${id}/restricted_contacts`, config);
}

async function createRestrictedContact(
  id: string,
  payload: Omit<RestrictedContact, 'uuid'>
): Promise<RestrictedContact> {
  return await api.post(`users/${id}/restricted_contacts`, payload);
}

async function removeRestrictedContact(id: string, restrictedContactId: string): Promise<RestrictedContact> {
  return await api.delete(`users/${id}/restricted_contacts/${restrictedContactId}`);
}

async function getUserQuota(id: string, quotaId: string): Promise<UserQuota> {
  return await api.get(`users/${id}/quota/${quotaId}`);
}

async function updateUserQuota(id: string, quota: UserQuota): Promise<UserQuota> {
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
  updateUserQuota,
};
