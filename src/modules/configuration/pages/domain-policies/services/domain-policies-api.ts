import apiv4 from '@/apiv4';
import { DomainPolicy } from '../types/DomainPolicy';

async function getDomainPolicyList(domainUuid: string, currentDomainOnly: boolean): Promise<DomainPolicy[]> {
  return await apiv4.get(`domain_policies?domainId=${domainUuid}&onlyCurrentDomain=${currentDomainOnly}`);
}

async function getDomainPolicyDetail(uuid: string, domainUuid: string): Promise<DomainPolicy> {
  return await apiv4.get(`domain_policies/${uuid}?domainId=${domainUuid}`);
}

async function assignDomainPolicy(domainUuid: string, DomainPolicyUuid: string) {
  return await apiv4.post(`domain_policies/${domainUuid}/mail_config/${DomainPolicyUuid}/assign`);
}

async function deleteDomainPolicy(payload: { uuid: string }): Promise<DomainPolicy> {
  return await apiv4.delete('domain_policies', { data: payload });
}
async function createDomainPolicy(payload: {
  description: string;
  domain: string;
  domainName?: string;
  footer: string;
  messagesEnglish: string;
  messagesFrench: string;
  messagesRussian: string;
  visible: boolean;
  readonly: boolean;
}) {
  return await apiv4.post(`mail_footers`, payload);
}

async function updateDomainPolicy(payload: DomainPolicy) {
  return await apiv4.put(`mail_contents`, payload);
}

export {
  getDomainPolicyList,
  getDomainPolicyDetail,
  assignDomainPolicy,
  deleteDomainPolicy,
  createDomainPolicy,
  updateDomainPolicy,
};
