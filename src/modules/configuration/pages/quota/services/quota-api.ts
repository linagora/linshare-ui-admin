import { AxiosRequestConfig } from 'axios';
import apiv4 from '@/apiv4';
import Quota from '../types/Quota';

async function getQuotaInformations(domainUuid: string) {
  return await apiv4.get(`quotas/domains/${domainUuid}`);
}

async function getQuotaUuid(domainUuid: string) {
  return await apiv4.get(`domains/${domainUuid}?parent=false&tree=true`);
}

async function switchMaintenanceMode(domainUuid: StringConstructor, quota: Quota): Promise<Quota> {
  return await apiv4.put(`quotas/domains/${domainUuid}`, quota);
}
export { getQuotaInformations, switchMaintenanceMode, getQuotaUuid };
