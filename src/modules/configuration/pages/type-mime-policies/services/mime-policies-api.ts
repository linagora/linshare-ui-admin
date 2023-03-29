import apiv4 from '@/apiv4';
import api from '@/api';
import MimePolicy from '../types/MimeType';

async function getMimePolicies(domainUuid: string, currentDomainOnly: boolean): Promise<MimePolicy[]> {
  return await apiv4.get(`mime_policies?domainId=${domainUuid}&onlyCurrentDomain=${currentDomainOnly}`);
}

async function createMimePolicy(payload: { name: string; domainId: string }): Promise<MimePolicy> {
  return await apiv4.post(`mime_policies`, payload);
}

async function deleteMimePolicy(mimeUuid: string): Promise<MimePolicy> {
  return await apiv4.delete(`mime_policies/${mimeUuid}`);
}

async function assignMimePolicy(domainUuid: string, mimeUuid: string) {
  return await api.post(`domains/${domainUuid}/mime_policy/${mimeUuid}/assign`);
}

export { getMimePolicies, createMimePolicy, deleteMimePolicy, assignMimePolicy };
