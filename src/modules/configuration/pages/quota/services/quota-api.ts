import { AxiosRequestConfig } from 'axios';
import apiv4 from '@/apiv4';
import Quota from '../types/Quota';
import ContainerQuota from '../types/Container';

async function getQuotaInformations(domainUuid: string) {
  return await apiv4.get(`quotas/domains/${domainUuid}`);
}

async function getQuotaUuid(domainUuid: string) {
  return await apiv4.get(`domains/${domainUuid}?parent=false&tree=true`);
}

async function updateQuota(domainUuid: StringConstructor, quota: Quota): Promise<Quota> {
  return await apiv4.put(`quotas/domains/${domainUuid}`, quota);
}

async function updateSubdomainQuota(containerUuid: string, ContainerQuota: ContainerQuota): Promise<ContainerQuota> {
  return await apiv4.put(`quotas/containers/${containerUuid}`, ContainerQuota);
}

async function getContainerInformations(containerUuid: string) {
  return await apiv4.get(`quotas/containers/${containerUuid}`);
}

export { getQuotaInformations, updateQuota, getQuotaUuid, getContainerInformations, updateSubdomainQuota };
