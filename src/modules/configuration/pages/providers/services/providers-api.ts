import api from '@/api';
import UserProvider from '../types/UserProvider';
import { LDAPGroupProvider } from '../types/GroupProvider';
import { LDAPWorkspaceProvider } from '../types/WorkspaceProvider';

async function getUserProviders(uuid: string): Promise<UserProvider[]> {
  return await api.get(`domains/${uuid}/user_providers`);
}

async function createUserProvider(uuid: string, payload: Partial<UserProvider>): Promise<UserProvider> {
  return await api.post(`domains/${uuid}/user_providers`, payload);
}

async function updateUserProvider(uuid: string, provider: UserProvider): Promise<UserProvider> {
  return await api.put(`domains/${uuid}/user_providers/${provider.uuid}`, provider);
}

async function deleteUserProvider(uuid: string, provider: UserProvider): Promise<UserProvider> {
  return await api.delete(`domains/${uuid}/user_providers/${provider.uuid}`);
}

async function getGroupProviders(domainUuid: string): Promise<LDAPGroupProvider[]> {
  return await api.get(`domains/${domainUuid}/group_providers`);
}

async function createGroupProvider(domainUuid: string, provider: LDAPGroupProvider): Promise<LDAPGroupProvider> {
  return await api.post(`domains/${domainUuid}/group_providers`, provider);
}

async function updateGroupProvider(domainUuid: string, provider: LDAPGroupProvider): Promise<LDAPGroupProvider> {
  return await api.put(`domains/${domainUuid}/group_providers/${provider.uuid}`, provider);
}

async function deleteGroupProvider(domainUuid: string, provider: LDAPGroupProvider): Promise<void> {
  return await api.delete(`domains/${domainUuid}/group_providers/${provider.uuid}`);
}

async function getWorkspaceProviders(domainUuid: string): Promise<LDAPWorkspaceProvider[]> {
  return await api.get(`domains/${domainUuid}/workspace_providers`);
}

async function createWorkspaceProvider(
  domainUuid: string,
  provider: LDAPWorkspaceProvider
): Promise<LDAPWorkspaceProvider> {
  return await api.post(`domains/${domainUuid}/workspace_providers`, provider);
}

async function updateWorkspaceProvider(
  domainUuid: string,
  provider: LDAPWorkspaceProvider
): Promise<LDAPWorkspaceProvider> {
  return await api.put(`domains/${domainUuid}/workspace_providers/${provider.uuid}`, provider);
}

async function deleteWorkspaceProvider(domainUuid: string, provider: LDAPWorkspaceProvider): Promise<void> {
  return await api.delete(`domains/${domainUuid}/workspace_providers/${provider.uuid}`);
}

export {
  createWorkspaceProvider,
  createGroupProvider,
  createUserProvider,
  deleteWorkspaceProvider,
  deleteUserProvider,
  deleteGroupProvider,
  getWorkspaceProviders,
  getGroupProviders,
  getUserProviders,
  updateWorkspaceProvider,
  updateGroupProvider,
  updateUserProvider,
};
