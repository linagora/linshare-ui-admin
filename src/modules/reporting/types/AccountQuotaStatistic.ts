export interface AccountQuotaStatistic {
  uuid: string;
  creationDate: number;
  statisticDate: number;
  domain: {
    uuid: string;
    name: string;
  };
  account: {
    uuid: string;
    name: string;
    email: string;
  };
  parentDomain: {
    uuid: string;
    name: string;
  };
  quota: number;
  quotaOverride: boolean;
  usedSpace: number;
  yesterdayUsedSpace: number;
  maintenance: boolean;
  batchModificationDate: number;
  domainShared: boolean;
  domainSharedOverride: boolean;
  maxFileSize: number;
  maxFileSizeOverride: boolean;
}
