import { AxiosRequestConfig } from 'axios';
import api from '@/api';
import User from '../types/User';
import type { Guest } from '@/modules/user/types/GuestList';
import { GuestListParameters } from '../types/GuestList';
import UserQuota from '../types/UserQuota';
import RestrictedContact from '../types/RestrictedContact';
import type { UsersListParameters } from '../types/UsersList';
import type { PaginatedList } from '@/core/types/PaginatedList';

async function listUsers(options: UsersListParameters = {}): Promise<PaginatedList<User>> {
  return await api.get('users', { params: options });
}

async function listGuestsThatUserIsModeratorOf(options: GuestListParameters, uuid: string | string[]): Promise<Guest> {
  return await api.get(`users/${uuid}/guests`, { params: options });
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
  listGuestsThatUserIsModeratorOf,
  updateUserQuota,
};
