import apiv4 from '@/apiv4';
import MimePolicies from '../types/MimeType';

async function getMimiPolicies(domainUuid: string, currentDomainOnly: boolean): Promise<MimePolicies[]> {
  return await apiv4.get(`mime_policies?domainId=${domainUuid}&onlyCurrentDomain=${currentDomainOnly}`);
}

async function createMimePolicy(payload: { name: string; domainId: string }): Promise<MimePolicies> {
  return await apiv4.post(`mime_policies`, payload);
}
export { getMimiPolicies, createMimePolicy };
