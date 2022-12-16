import api from '@/api';
import { Functionality } from '@/modules/configuration/pages/parameters/types/Functionality';

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

export { getFunctionalties, getFunctionality, updateFunctionality };
