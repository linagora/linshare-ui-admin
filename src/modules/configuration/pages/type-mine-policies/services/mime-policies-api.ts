import apiv4 from '@/apiv4';
import MimePolicies from '../types/MimeType';

async function getMimiPolicies(domainUuid: string, currentDomainOnly: boolean): Promise<MimePolicies[]> {
  return await apiv4.get(`mime_policies?domainId=${domainUuid}&onlyCurrentDomain=${currentDomainOnly}`);
}

export { getMimiPolicies };
