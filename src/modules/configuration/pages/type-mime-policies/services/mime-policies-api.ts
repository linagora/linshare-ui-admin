import apiv4 from '@/apiv4';
import api from '@/api';
import { MimePolicy, MimeType } from '../types/MimeType';

async function getMimePolicies(domainUuid: string, currentDomainOnly: boolean): Promise<MimePolicy[]> {
  return await apiv4.get(`mime_policies?domainId=${domainUuid}&onlyCurrentDomain=${currentDomainOnly}`);
}

async function updateMimePolicy(payload: MimePolicy): Promise<MimePolicy> {
  return await apiv4.put(`mime_policies`, payload);
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

async function getMimePolicy(mimePolicyUuid: string): Promise<MimePolicy> {
  return await apiv4.get(`mime_policies/${mimePolicyUuid}?full=true`);
}

async function enableAllTypeInMimePolicy(mimePolicyUuid: string): Promise<MimePolicy> {
  return await apiv4.put(`mime_policies/${mimePolicyUuid}/enable_all`);
}

async function disableAllTypeInMimePolicy(mimePolicyUuid: string): Promise<MimePolicy> {
  return await apiv4.put(`mime_policies/${mimePolicyUuid}/disable_all`);
}

async function updateMimeType(mimeType: MimeType) {
  return await apiv4.put(`mime_types`, mimeType);
}

export {
  getMimePolicy,
  updateMimeType,
  getMimePolicies,
  updateMimePolicy,
  deleteMimePolicy,
  createMimePolicy,
  assignMimePolicy,
  enableAllTypeInMimePolicy,
  disableAllTypeInMimePolicy,
};
