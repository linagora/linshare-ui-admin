import { AxiosRequestConfig } from 'axios';
import api from '@/api';
import Domain from '@/modules/domain/types/Domain';
import DomainTreeNode from '../types/DomainTreeNode';
import {
  LDAPUserProvider,
  OIDCUserProvider
} from '../types/UserProvider';

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

export {
  getDomain,
  getDomains,
  updateDomain,
  createDomain,
  getUserProviders,
  createUserProvider,
  updateUserProvider,
  deleteUserProvider
};
