import { AxiosRequestConfig } from 'axios';
import api from '@/api';
import Domain from '@/modules/domain/types/Domain';
import DomainTreeNode from '../types/DomainTreeNode';
import {
  LDAPUserProvider,
  OIDCUserProvider
} from '../types/UserProvider';
import { LDAPGroupProvider } from '../types/GroupProvider';

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

async function getUserProviders (uuid: string): Promise<LDAPUserProvider[]> {
  return await api.get(`domains/${uuid}/user_providers`);
}

async function createUserProvider (uuid: string, payload: Partial<LDAPUserProvider | OIDCUserProvider>): Promise<LDAPUserProvider | OIDCUserProvider> {
  return await api.post(`domains/${uuid}/user_providers`, payload);
}

async function updateUserProvider (uuid: string, provider: LDAPUserProvider | OIDCUserProvider): Promise<LDAPUserProvider | OIDCUserProvider> {
  return await api.put(`domains/${uuid}/user_providers/${provider.uuid}`, provider);
}

async function deleteUserProvider (uuid: string, provider: LDAPUserProvider | OIDCUserProvider): Promise<LDAPUserProvider | OIDCUserProvider> {
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

async function deletGroupProvider (domainUuid: string, provider: LDAPGroupProvider) {
  return await api.delete(`domains/${domainUuid}/group_providers/${provider.uuid}`);
}

export {
  createDomain,
  createGroupProvider,
  createUserProvider,
  deleteUserProvider,
  deletGroupProvider,
  getDomain,
  getDomains,
  getGroupProviders,
  getUserProviders,
  updateDomain,
  updateGroupProvider,
  updateUserProvider
};
