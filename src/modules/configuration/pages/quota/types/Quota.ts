export default interface DomainQuota {
  creationDate?: number;
  domain?: {
    label?: string;
    identifier?: string;
    type?: string;
  };
  parentDomain?: {
    label?: string;
    identifier?: string;
    type?: string;
  };
  currentValueForSubdomains?: number;
  defaultDomainShared?: boolean;
  defaultDomainSharedOverride?: boolean;
  defaultQuota: number;
  defaultQuotaOverride?: boolean;
  maintenance?: boolean;
  modificationDate?: number;
  quota: number;
  quotaOverride?: boolean;
  usedSpace: number;
  uuid: string;
  yesterdayUsedSpace?: number;
  batchModificationDate?: number;
  domainShared?: boolean;
  domainSharedOverride?: boolean;
  containerUuids?: string[];
}

export const EMPTY_QUOTA: DomainQuota = {
  creationDate: 0,
  currentValueForSubdomains: 0,
  defaultDomainShared: false,
  defaultDomainSharedOverride: false,
  defaultQuota: 0,
  defaultQuotaOverride: false,
  maintenance: false,
  modificationDate: 0,
  quota: 0,
  quotaOverride: false,
  usedSpace: 0,
  uuid: '',
  yesterdayUsedSpace: 0,
  domainShared: false,
  domainSharedOverride: false,
};
