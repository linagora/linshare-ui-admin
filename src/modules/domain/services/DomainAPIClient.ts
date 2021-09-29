import { AxiosRequestConfig } from 'axios';
import AdminAPIClient from '@/core/services/AdminAPIClient';
import Domain from '@/modules/domain/type/Domain';
import DomainTreeNode from '../type/DomainTreeNode';

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
}

export default new DomainAPIClient();
