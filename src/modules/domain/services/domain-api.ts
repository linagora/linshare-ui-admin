import { AxiosRequestConfig } from 'axios';
import api from '@/api';
import Domain from '@/modules/domain/types/Domain';
import DomainTreeNode from '../types/DomainTreeNode';
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

export { createDomain, deleteDomain, getDomain, getDomains, listDomainsR2, updateDomain };
