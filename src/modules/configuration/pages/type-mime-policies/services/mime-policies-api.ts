import apiv4 from '@/apiv4';
import { MimePolicy } from '../types/MimeType';

async function getMimiPolicies(domainUuid: string, currentDomainOnly: boolean): Promise<MimePolicy[]> {
  return await apiv4.get(`mime_policies?domainId=${domainUuid}&onlyCurrentDomain=${currentDomainOnly}`);
}
async function deleteMimePolicy(mimeUuid: string): Promise<MimePolicy> {
  return await apiv4.delete(`mime_policies/${mimeUuid}`);
}

async function createMimePolicy(payload: { name: string; domainId: string }): Promise<MimePolicy> {
  return await apiv4.post(`mime_policies`, payload);
}

export { getMimiPolicies, createMimePolicy, deleteMimePolicy };
