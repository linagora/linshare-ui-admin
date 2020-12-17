import { AxiosRequestConfig } from 'axios';
import AdminAPIClient from '@/core/services/AdminAPIClient';
import Domain from '@/modules/domain/type/Domain';

class DomainAPIClient extends AdminAPIClient {
  constructor () {
    super('domains');
  }

  async getDomains (config?: AxiosRequestConfig): Promise<Domain[]> {
    return await this.transport.get('', config);
  };
}

export default new DomainAPIClient();
