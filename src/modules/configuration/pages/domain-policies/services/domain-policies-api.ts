import apiv4 from '@/apiv4';
import api from '@/api';
import Domain from '@/core/types/Domain';
import { DomainPolicy } from '../types/DomainPolicy';

async function getDomainPolicyList(domainUuid: string, currentDomainOnly: boolean): Promise<DomainPolicy[]> {
  return await apiv4.get(`domain_policies?domainId=${domainUuid}&onlyCurrentDomain=${currentDomainOnly}`);
}

async function getDomainPolicyDetail(uuid: string): Promise<DomainPolicy> {
  return await apiv4.get(`domain_policies/${uuid}`);
}

async function assignDomainPolicy(domainUuid: string, PolicyUuid: string) {
  return await api.post(`domains/${domainUuid}/domain_policy/${PolicyUuid}/assign`);
}

async function deleteDomainPolicy(payload: DomainPolicy): Promise<DomainPolicy> {
  return await apiv4.delete('domain_policies', { data: payload });
}
async function createDomainPolicy(payload: {
  accessPolicy: {
    rules: {
      type: 'ALLOW' | 'ALLOW_ALL' | 'DENY' | 'DENY_ALL';
      domain: Domain;
    }[];
  };
  label: string;
  description: string;
}) {
  return await apiv4.post(`domain_policies`, payload);
}

async function updateDomainPolicy(payload: DomainPolicy) {
  return await apiv4.put(`domain_policies`, payload);
}

export {
  getDomainPolicyList,
  getDomainPolicyDetail,
  assignDomainPolicy,
  deleteDomainPolicy,
  createDomainPolicy,
  updateDomainPolicy,
};
