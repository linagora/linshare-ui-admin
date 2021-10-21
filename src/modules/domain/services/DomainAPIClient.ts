import { AxiosRequestConfig } from 'axios';
import AdminAPIClient from '@/core/services/AdminAPIClient';
import Domain from '@/modules/domain/type/Domain';
import DomainTreeNode from '../type/DomainTreeNode';
import LDAPUserProvider from '../type/LDAPUserProvider';

class DomainAPIClient extends AdminAPIClient {
  constructor () {
    super('domains');
  }

  async getDomains (config?: AxiosRequestConfig): Promise<Domain[] | DomainTreeNode[]> {
    return await this.transport.get('', config);
  }

  async getDomain (uuid: string, configs?: AxiosRequestConfig): Promise<Domain> {
    return await this.transport.get(uuid, configs);
  }

  async updateDomain (domain: Domain) {
    return await this.transport.put(domain.uuid, domain);
  }

  async createDomain (domain: Omit<Domain, 'uuid'>, dedicatedDomainPolicy = false): Promise<Domain> {
    return await this.transport.post('', domain, { params: { dedicatedDomainPolicy } });
  }

  async getUserProviders (uuid: string): Promise<LDAPUserProvider[]> {
    return await this.transport.get(`${uuid}/user_providers`);
  }

  async createUserProvider (uuid: string, payload: Partial<LDAPUserProvider>): Promise<LDAPUserProvider> {
    return await this.transport.post(`${uuid}/user_providers`, payload);
  }

  async updateUserProvider (uuid: string, provider: LDAPUserProvider): Promise<LDAPUserProvider> {
    return await this.transport.put(`${uuid}/user_providers/${provider.uuid}`, provider);
  }

  async deleteUserProvider (uuid: string, provider: LDAPUserProvider): Promise<LDAPUserProvider> {
    return await this.transport.delete(`${uuid}/user_providers/${provider.uuid}`);
  }
}

export default new DomainAPIClient();
