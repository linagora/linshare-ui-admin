import { reactive, ref, watch, watchEffect } from 'vue';
import { message } from 'ant-design-vue';
import { APIError } from '@/core/types/APIError';
import {
  getQuotaInformations,
  getQuotaUuid,
  getContainerInformations,
  updateQuota,
  updateSubdomainQuota,
} from '../services/quota-api';
import Quota, { EMPTY_QUOTA } from '../types/Quota';
import QuotaContainer, { EMPTY_CONTAINER } from '../types/Container';
import { find, byteTo, toByte, StorageUnit } from '@/core/utils/unitStorage';

const domainQuotaInformations = reactive<Quota>({ ...EMPTY_QUOTA });
const parentDomainInformations = reactive<Quota>({ ...EMPTY_QUOTA });
const subdomainContainerInformations = reactive<QuotaContainer>({ ...EMPTY_CONTAINER });
const AllocationContainerInformations = reactive<QuotaContainer>({ ...EMPTY_CONTAINER });
const domainQuotaUuid = ref();
const SubdomainContainerUuid = ref();
const parentDomainQuotaUuid = ref();
const form = reactive<{
  domain_quota_and_used_space: {
    quotaSpace: number;
    quotaUnit: StorageUnit['label'] | string;
    maintenance: boolean | undefined;
    domainShared: boolean | undefined;
    domainSharedOverride: boolean | undefined;
    quotaOverride: boolean | undefined;
  };
  allocation_container: {
    quota: number;
    accountQuota: number;
    maxFileSize: number;
  };
  subdomain_allocation_settings: {
    quotaSpace: number;
    quotaUnit: StorageUnit['label'] | string;
    personalQuota: number;
    personalQuotaUnit: StorageUnit['label'] | string;
    defaultQuotaPerUser: number;
    defaultQuotaPerUserUnit: StorageUnit['label'] | string;
    defaultPersonalQuotaMaxFileSize: number;
    defaultPersonalQuotaMaxFileSizeUnit: StorageUnit['label'] | string;
    defaultTotalAllocatedQuota: number;
    defaultTotalAllocatedQuotaUnit: StorageUnit['label'] | string;
    defaultSharedspaceQuotaMaxFileSize: number;
    defaultSharedspaceQuotaMaxFileSizeUnit: StorageUnit['label'] | string;
    shared: boolean | undefined;
    quotaOverride: boolean | undefined;
    defaultAccountQuotaOverride: boolean | undefined;
    defaultMaxFileSizeOverride: boolean | undefined;
    defaultQuotaOverride: boolean | undefined;
    maxFileSizeOverride: boolean | undefined;
  };
  saverCheck: boolean;
}>({
  domain_quota_and_used_space: {
    quotaSpace: 0,
    quotaUnit: 'TB',
    maintenance: false,
    domainShared: false,
    domainSharedOverride: false,
    quotaOverride: false,
  },
  allocation_container: {
    quota: 0,
    accountQuota: 0,
    maxFileSize: 0,
  },
  subdomain_allocation_settings: {
    quotaSpace: 0,
    quotaUnit: 'TB',
    personalQuota: 0,
    personalQuotaUnit: 'TB',
    defaultQuotaPerUser: 0,
    defaultQuotaPerUserUnit: 'TB',
    defaultPersonalQuotaMaxFileSize: 0,
    defaultPersonalQuotaMaxFileSizeUnit: 'TB',
    defaultTotalAllocatedQuota: 0,
    defaultTotalAllocatedQuotaUnit: 'TB',
    defaultSharedspaceQuotaMaxFileSize: 0,
    defaultSharedspaceQuotaMaxFileSizeUnit: 'TB',
    shared: false,
    quotaOverride: false,
    defaultAccountQuotaOverride: false,
    defaultMaxFileSizeOverride: false,
    defaultQuotaOverride: false,
    maxFileSizeOverride: false,
  },
  saverCheck: false,
});

export default function useQuota() {
  // local data
  const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  // methods
  async function getInformations(domainUuid: string) {
    try {
      domainQuotaUuid.value = await getQuotaUuid(domainUuid);
      const message = await getQuotaInformations(domainQuotaUuid.value.quota);
      Object.assign(domainQuotaInformations, message);
      if (domainQuotaInformations.parentDomain?.identifier) {
        parentDomainQuotaUuid.value = await getQuotaUuid(domainQuotaInformations.parentDomain?.identifier);
        const parent = await getQuotaInformations(parentDomainQuotaUuid.value.quota);
        Object.assign(parentDomainInformations, parent);
      }
      _generateFormData(domainQuotaInformations);
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
  }

  async function getSubdomainBlockInformations(domainUuid: string) {
    try {
      domainQuotaUuid.value = await getQuotaUuid(domainUuid);
      SubdomainContainerUuid.value = await getQuotaInformations(domainQuotaUuid.value.quota);
      const message = await getContainerInformations(SubdomainContainerUuid.value.containerUuids[1]);
      Object.assign(subdomainContainerInformations, message);
      _generateFormDataSubdomain(subdomainContainerInformations);
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
  }

  async function getAllocationBlockInformations(domainUuid: string) {
    try {
      domainQuotaUuid.value = await getQuotaUuid(domainUuid);
      SubdomainContainerUuid.value = await getQuotaInformations(domainQuotaUuid.value.quota);
      const message = await getContainerInformations(SubdomainContainerUuid.value.containerUuids[0]);
      Object.assign(AllocationContainerInformations, message);
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
  }

  async function resetDomainQuotaInformation(domainUuid: string) {
    await getInformations(domainUuid);
  }

  function niceBytes(x: any) {
    let l = 0,
      n = parseInt(x, 10) || 0;

    while (n >= 1024 && ++l) {
      n = n / 1024;
    }

    return n.toFixed(1) + ' ' + units[l];
  }

  async function saveQuota(domainUuid: string, successMessage: string) {
    try {
      await updateQuota(domainQuotaUuid.value.quota, savePaypload());
      await updateSubdomainQuota(subdomainContainerInformations.uuid, saveSubdomainPaypload());
      message.success(successMessage);
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
    resetDomainQuotaInformation(domainUuid);
  }

  function _generateFormData(quota: Quota) {
    form.domain_quota_and_used_space.maintenance = quota.maintenance;
    form.domain_quota_and_used_space.quotaSpace = byteTo(domainQuotaInformations.quota, undefined);
    form.domain_quota_and_used_space.quotaUnit = find(domainQuotaInformations.quota);
    form.domain_quota_and_used_space.domainShared = domainQuotaInformations.domainShared;
    form.domain_quota_and_used_space.domainSharedOverride = domainQuotaInformations.domainSharedOverride;
    form.domain_quota_and_used_space.quotaOverride = domainQuotaInformations.quotaOverride;
  }

  function _generateFormDataSubdomain(quota: QuotaContainer) {
    form.subdomain_allocation_settings.quotaUnit = find(domainQuotaInformations.defaultQuota);
    form.subdomain_allocation_settings.quotaSpace = byteTo(domainQuotaInformations.defaultQuota, undefined);
    form.subdomain_allocation_settings.personalQuota = byteTo(quota.defaultQuota, undefined);
    form.subdomain_allocation_settings.personalQuotaUnit = find(quota.defaultQuota);
    form.subdomain_allocation_settings.defaultQuotaPerUser = byteTo(quota.defaultAccountQuota, undefined);
    form.subdomain_allocation_settings.defaultQuotaPerUserUnit = find(quota.defaultAccountQuota);
    form.subdomain_allocation_settings.defaultPersonalQuotaMaxFileSize = byteTo(quota.defaultMaxFileSize, undefined);
    form.subdomain_allocation_settings.defaultPersonalQuotaMaxFileSizeUnit = find(quota.defaultMaxFileSize);
    form.subdomain_allocation_settings.defaultTotalAllocatedQuota = AllocationContainerInformations.defaultQuota;
    form.subdomain_allocation_settings.shared = domainQuotaInformations.defaultDomainShared;
    form.subdomain_allocation_settings.quotaOverride = quota.quotaOverride;
    form.subdomain_allocation_settings.defaultAccountQuotaOverride = quota.defaultAccountQuotaOverride;
    form.subdomain_allocation_settings.defaultMaxFileSizeOverride = quota.defaultMaxFileSizeOverride;
    form.subdomain_allocation_settings.defaultQuotaOverride = quota.defaultQuotaOverride;
    form.subdomain_allocation_settings.maxFileSizeOverride = quota.maxFileSizeOverride;
  }

  function savePaypload() {
    return {
      creationDate: domainQuotaInformations.creationDate,
      currentValueForSubdomains: domainQuotaInformations.currentValueForSubdomains,
      defaultDomainShared: form.subdomain_allocation_settings.shared,
      defaultDomainSharedOverride: domainQuotaInformations.defaultDomainSharedOverride,
      defaultQuota: toByte(form.subdomain_allocation_settings.quotaSpace, form.subdomain_allocation_settings.quotaUnit),
      defaultQuotaOverride: domainQuotaInformations.defaultDomainSharedOverride,
      maintenance: form.domain_quota_and_used_space.maintenance,
      modificationDate: domainQuotaInformations.modificationDate,
      quota: toByte(form.domain_quota_and_used_space.quotaSpace, form.domain_quota_and_used_space.quotaUnit),
      quotaOverride: domainQuotaInformations.quotaOverride,
      usedSpace: domainQuotaInformations.usedSpace,
      uuid: domainQuotaInformations.uuid,
      domain: {
        label: domainQuotaInformations.domain?.label,
        identifier: domainQuotaInformations.domain?.identifier,
        type: domainQuotaInformations.domain?.type,
      },
      parentDomain: {
        label: domainQuotaInformations.parentDomain?.label,
        identifier: domainQuotaInformations.parentDomain?.identifier,
        type: domainQuotaInformations.parentDomain?.type,
      },
      batchModificationDate: domainQuotaInformations.batchModificationDate,
      domainShared: domainQuotaInformations.domainShared,
      domainSharedOverride: domainQuotaInformations.domainSharedOverride,
    };
  }

  function saveSubdomainPaypload() {
    return {
      accountQuota: form.allocation_container.accountQuota,
      accountQuotaOverride: form.subdomain_allocation_settings.quotaOverride,
      batchModificationDate: subdomainContainerInformations.batchModificationDate,
      creationDate: subdomainContainerInformations.creationDate,
      defaultAccountQuota: toByte(
        form.subdomain_allocation_settings.defaultQuotaPerUser,
        form.subdomain_allocation_settings.defaultQuotaPerUserUnit
      ),
      defaultAccountQuotaOverride: form.subdomain_allocation_settings.defaultAccountQuotaOverride,
      defaultMaxFileSize: toByte(
        form.subdomain_allocation_settings.defaultPersonalQuotaMaxFileSize,
        form.subdomain_allocation_settings.defaultPersonalQuotaMaxFileSizeUnit
      ),
      defaultMaxFileSizeOverride: form.subdomain_allocation_settings.defaultMaxFileSizeOverride,
      defaultQuota: toByte(
        form.subdomain_allocation_settings.personalQuota,
        form.subdomain_allocation_settings.personalQuotaUnit
      ),
      defaultQuotaOverride: form.subdomain_allocation_settings.defaultQuotaOverride,
      domain: {
        identifier: subdomainContainerInformations.domain.identifier,
        label: subdomainContainerInformations.domain.label,
        type: subdomainContainerInformations.domain.type,
      },
      parentDomain: {
        identifier: parentDomainInformations.parentDomain?.identifier,
        label: parentDomainInformations.parentDomain?.label,
      },
      maintenance: false,
      maxFileSize: form.allocation_container.maxFileSize,
      maxFileSizeOverride: form.subdomain_allocation_settings.maxFileSizeOverride,
      modificationDate: subdomainContainerInformations.modificationDate,
      quota: form.allocation_container.quota,
      quotaOverride: form.subdomain_allocation_settings.quotaOverride,
      type: subdomainContainerInformations.type,
      usedSpace: subdomainContainerInformations.usedSpace,
      uuid: subdomainContainerInformations.uuid,
      yersterdayUsedSpace: subdomainContainerInformations.yersterdayUsedSpace,
    };
  }

  function defaultSubdomainQuotaLogic() {
    if (
      toByte(form.domain_quota_and_used_space.quotaSpace, form.domain_quota_and_used_space.quotaUnit) <
      domainQuotaInformations.defaultQuota
    ) {
      return true;
    }
    return false;
  }

  function defaultMaxiQuotaLogic() {
    if (
      toByte(form.domain_quota_and_used_space.quotaSpace, form.domain_quota_and_used_space.quotaUnit) >
      parentDomainInformations.quota
    ) {
      return true;
    }
    return false;
  }

  function personalSpaceQuotaLogic() {
    if (
      toByte(form.subdomain_allocation_settings.personalQuota, form.subdomain_allocation_settings.personalQuotaUnit) >
      toByte(form.subdomain_allocation_settings.quotaSpace, form.subdomain_allocation_settings.quotaUnit)
    ) {
      return true;
    }
    return false;
  }

  function personalSpaceQuotaPerUserLogic() {
    if (
      toByte(
        form.subdomain_allocation_settings.defaultQuotaPerUser,
        form.subdomain_allocation_settings.defaultQuotaPerUserUnit
      ) > toByte(form.subdomain_allocation_settings.personalQuota, form.subdomain_allocation_settings.personalQuotaUnit)
    ) {
      return true;
    }
    return false;
  }

  function personalSpaceMaxSizeLogic() {
    if (
      toByte(
        form.subdomain_allocation_settings.defaultPersonalQuotaMaxFileSize,
        form.subdomain_allocation_settings.defaultPersonalQuotaMaxFileSizeUnit
      ) >
      toByte(
        form.subdomain_allocation_settings.defaultQuotaPerUser,
        form.subdomain_allocation_settings.defaultQuotaPerUserUnit
      )
    ) {
      return true;
    }

    return false;
  }

  function maxQuotaLogic() {
    if (
      toByte(form.subdomain_allocation_settings.quotaSpace, form.subdomain_allocation_settings.quotaUnit) >
      domainQuotaInformations.quota
    ) {
      return true;
    }
    return false;
  }

  watchEffect(() => {
    if (
      defaultMaxiQuotaLogic() ||
      defaultSubdomainQuotaLogic() ||
      personalSpaceQuotaPerUserLogic() ||
      personalSpaceMaxSizeLogic() ||
      personalSpaceQuotaLogic() ||
      maxQuotaLogic()
    ) {
      form.saverCheck = true;
    } else {
      form.saverCheck = false;
    }
  });

  return {
    form,
    domainQuotaInformations,
    subdomainContainerInformations,
    niceBytes,
    getInformations,
    saveQuota,
    resetDomainQuotaInformation,
    defaultMaxiQuotaLogic,
    defaultSubdomainQuotaLogic,
    parentDomainInformations,
    getSubdomainBlockInformations,
    AllocationContainerInformations,
    getAllocationBlockInformations,
    personalSpaceQuotaLogic,
    personalSpaceQuotaPerUserLogic,
    personalSpaceMaxSizeLogic,
    maxQuotaLogic,
  };
}
