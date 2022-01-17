import { AxiosRequestConfig } from 'axios';
import api from '@/api';
import Domain from '@/modules/domain/types/Domain';
import DomainTreeNode from '../types/DomainTreeNode';
import UserProvider from '../types/UserProvider';
import { LDAPGroupProvider } from '../types/GroupProvider';
import { LDAPWorkspaceProvider } from '../types/WorkspaceProvider';

async function getDomains (config?: AxiosRequestConfig): Promise<Domain[] | DomainTreeNode[]> {
  return await api.get('domains', config);
}

async function getDomain (uuid: string, configs?: AxiosRequestConfig): Promise<Domain> {
  return await api.get(`domains/${uuid}`, configs);
}

async function updateDomain (domain: Domain) {
  return await api.put(`domains/${domain.uuid}`, domain);
}

async function createDomain (domain: Omit<Domain, 'uuid'>, dedicatedDomainPolicy = false): Promise<Domain> {
  return await api.post('domains', domain, { params: { dedicatedDomainPolicy } });
}

async function deleteDomain (domain: Domain): Promise<Domain> {
  return await api.delete(`domains/${domain.uuid}`);
}

async function getUserProviders (uuid: string): Promise<UserProvider[]> {
  return await api.get(`domains/${uuid}/user_providers`);
}

async function createUserProvider (uuid: string, payload: Partial<UserProvider>): Promise<UserProvider> {
  return await api.post(`domains/${uuid}/user_providers`, payload);
}

async function updateUserProvider (uuid: string, provider: UserProvider): Promise<UserProvider> {
  return await api.put(`domains/${uuid}/user_providers/${provider.uuid}`, provider);
}

async function deleteUserProvider (uuid: string, provider: UserProvider): Promise<UserProvider> {
  return await api.delete(`domains/${uuid}/user_providers/${provider.uuid}`);
}

async function getGroupProviders (domainUuid: string): Promise<LDAPGroupProvider[]> {
  return await api.get(`domains/${domainUuid}/group_providers`);
}

async function createGroupProvider (domainUuid: string, provider: LDAPGroupProvider): Promise<LDAPGroupProvider> {
  return await api.post(`domains/${domainUuid}/group_providers`, provider);
}

async function updateGroupProvider (domainUuid: string, provider: LDAPGroupProvider): Promise<LDAPGroupProvider> {
  return await api.put(`domains/${domainUuid}/group_providers/${provider.uuid}`, provider);
}

async function deleteGroupProvider (domainUuid: string, provider: LDAPGroupProvider) {
  return await api.delete(`domains/${domainUuid}/group_providers/${provider.uuid}`);
}

async function getWorkspaceProviders (domainUuid: string): Promise<LDAPWorkspaceProvider[]> {
  return await api.get(`domains/${domainUuid}/workspace_providers`);
}

async function createWorkspaceProvider (domainUuid: string, provider: LDAPWorkspaceProvider): Promise<LDAPWorkspaceProvider> {
  return await api.post(`domains/${domainUuid}/workspace_providers`, provider);
}

async function updateWorkspaceProvider (domainUuid: string, provider: LDAPWorkspaceProvider): Promise<LDAPWorkspaceProvider> {
  return await api.put(`domains/${domainUuid}/workspace_providers/${provider.uuid}`, provider);
}

async function deleteWorkspaceProvider (domainUuid: string, provider: LDAPWorkspaceProvider) {
  return await api.delete(`domains/${domainUuid}/workspace_providers/${provider.uuid}`);
}

async function getFunctionalties (domainUuid: string, options?: { includeSubs: boolean }) {
  return await api.get(`domains/${domainUuid}/functionalities`, {
    params: {
      subs: options?.includeSubs
    }
  });
}

export {
  createDomain,
  createWorkspaceProvider,
  createGroupProvider,
  createUserProvider,
  deleteDomain,
  deleteWorkspaceProvider,
  deleteUserProvider,
  deleteGroupProvider,
  getDomain,
  getDomains,
  getFunctionalties,
  getWorkspaceProviders,
  getGroupProviders,
  getUserProviders,
  updateDomain,
  updateWorkspaceProvider,
  updateGroupProvider,
  updateUserProvider
};
