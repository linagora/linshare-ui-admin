import { AxiosRequestConfig } from 'axios';
import api from '@/api';
import Domain from '@/modules/domain/types/Domain';
import DomainTreeNode from '../types/DomainTreeNode';
import UserProvider from '../types/UserProvider';
import WelcomeMessage from '../types/WelcomeMessages';
import { LDAPGroupProvider } from '../types/GroupProvider';
import { LDAPWorkspaceProvider } from '../types/WorkspaceProvider';
import { Functionality } from '@/core/types/Functionality';
import { PaginatedList } from '@/core/types/PaginatedList';

async function listDomainsR2(config?: AxiosRequestConfig): Promise<PaginatedList<Domain>> {
  return api.get('domains/r2', config);
}

async function getDomains(config?: AxiosRequestConfig): Promise<Domain[] | DomainTreeNode[]> {
  return await api.get('domains', config);
}

async function getDomain(uuid: string, configs?: AxiosRequestConfig): Promise<Domain> {
  return await api.get(`domains/${uuid}`, configs);
}

async function updateDomain(domain: Domain): Promise<Domain> {
  return await api.put(`domains/${domain.uuid}`, domain);
}

async function createDomain(domain: Omit<Domain, 'uuid'>, dedicatedDomainPolicy = false): Promise<Domain> {
  return await api.post('domains', domain, {
    params: { dedicatedDomainPolicy },
  });
}

async function deleteDomain(domain: Domain): Promise<Domain> {
  return await api.delete(`domains/${domain.uuid}`);
}

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

async function getFunctionalties(
  domainUuid: string,
  options?: { includeSubs?: boolean; parent?: string }
): Promise<Functionality[]> {
  return await api.get(`domains/${domainUuid}/functionalities`, {
    params: {
      subs: options?.includeSubs,
      parentIdentifier: options?.parent,
    },
  });
}

async function getFunctionality(domainUuid: string, identifier: string): Promise<Functionality> {
  return await api.get(`domains/${domainUuid}/functionalities/${identifier}`);
}

async function updateFunctionality(domainUuid: string, functionality: Functionality): Promise<Functionality> {
  return await api.put(`domains/${domainUuid}/functionalities/${functionality.identifier}`, functionality);
}

async function getWelcomeMessages(domainUuid: string): Promise<WelcomeMessage[]> {
  return await api.get(`domains/${domainUuid}/welcome_messages`);
}

async function getWelcomeMessage(domainUuid: string, messageUuid: string): Promise<WelcomeMessage> {
  return await api.get(`domains/${domainUuid}/welcome_messages/${messageUuid}`);
}

async function updateWelcomeMessage(domainUuid: string, message: WelcomeMessage): Promise<WelcomeMessage> {
  return await api.put(`domains/${domainUuid}/welcome_messages/${message.uuid}`, message);
}

async function createWelcomeMessage(domainUuid: string, message: WelcomeMessage): Promise<WelcomeMessage> {
  return await api.post(`domains/${domainUuid}/welcome_messages/`, message);
}

async function deleteWelcomeMessage(domainUuid: string, messageUuid: string): Promise<WelcomeMessage> {
  return await api.delete(`domains/${domainUuid}/welcome_messages/${messageUuid}`, {
    data: {},
  });
}

async function assignWelcomeMessage(domainUuid: string, messageUuid: string): Promise<WelcomeMessage> {
  return await api.put(`domains/${domainUuid}/welcome_messages/${messageUuid}/assign`, {
    assign: true,
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
  getFunctionality,
  getWorkspaceProviders,
  getGroupProviders,
  getUserProviders,
  listDomainsR2,
  updateDomain,
  updateWorkspaceProvider,
  updateGroupProvider,
  updateFunctionality,
  updateUserProvider,
  getWelcomeMessages,
  getWelcomeMessage,
  updateWelcomeMessage,
  createWelcomeMessage,
  deleteWelcomeMessage,
  assignWelcomeMessage,
};
