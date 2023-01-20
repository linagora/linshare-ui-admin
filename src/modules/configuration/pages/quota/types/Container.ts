export default interface QuotaContainer {
  accountQuota: number;
  accountQuotaOverride: boolean;
  batchModificationDate: number;
  creationDate: number;
  defaultAccountQuota: number;
  defaultAccountQuotaOverride: boolean;
  defaultMaxFileSize: number;
  defaultMaxFileSizeOverride: boolean;
  defaultQuota: number;
  defaultQuotaOverride: boolean;
  domain: {
    identifier: string;
    label: string;
    type: string;
  };
  maintenance: boolean;
  maxFileSize: number;
  maxFileSizeOverride: boolean;
  modificationDate: number;
  quota: number;
  quotaOverride: boolean;
  type: string;
  usedSpace: number;
  uuid: string;
  yersterdayUsedSpace: number;
}

export const EMPTY_CONTAINER: QuotaContainer = {
  accountQuota: 0,
  accountQuotaOverride: false,
  batchModificationDate: 0,
  creationDate: 0,
  defaultAccountQuota: 0,
  defaultAccountQuotaOverride: false,
  defaultMaxFileSize: 0,
  defaultMaxFileSizeOverride: false,
  defaultQuota: 0,
  defaultQuotaOverride: false,
  domain: {
    identifier: '',
    label: '',
    type: '',
  },
  maintenance: false,
  maxFileSize: 0,
  maxFileSizeOverride: false,
  modificationDate: 0,
  quota: 0,
  quotaOverride: false,
  type: '',
  usedSpace: 0,
  uuid: '',
  yersterdayUsedSpace: 0,
};
