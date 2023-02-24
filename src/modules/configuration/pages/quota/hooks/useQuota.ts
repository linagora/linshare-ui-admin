import { reactive, ref, watchEffect } from 'vue';
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
import { storeToRefs } from 'pinia';
import { useDomainStore } from '@/modules/domain/store';

// hook data
const subdomainContainerInformations = reactive<QuotaContainer>({ ...EMPTY_CONTAINER });
const allocationContainerInformations = reactive<QuotaContainer>({ ...EMPTY_CONTAINER });
const domainQuotaUuid = ref();
const parentDomainQuotaUuid = ref();
const domainQuotaInformations = reactive<Quota>({ ...EMPTY_QUOTA });
const parentDomainInformations = reactive<Quota>({ ...EMPTY_QUOTA });
const parentSubdomainInformations = reactive<QuotaContainer>({ ...EMPTY_CONTAINER });
const parentAllocationInformations = reactive<QuotaContainer>({ ...EMPTY_CONTAINER });

const form = reactive<{
  domainQuotaAndUsedSpace: {
    quotaSpace: number;
    quotaUnit: StorageUnit['label'] | string;
    maintenance: boolean | undefined;
    domainShared: boolean | undefined;
    domainSharedOverride: boolean | undefined;
    quotaOverride: boolean | undefined;
  };
  subdomainAllocationSettings: {
    quotaSpace: number;
    quotaUnit: StorageUnit['label'] | string;
    personalSpacesAllocatedQuotaForAllPersonalSpaces: number;
    personalSpacesAllocatedQuotaForAllPersonalSpacesUnit: StorageUnit['label'] | string;
    personalSpacesAllocatedQuotaForAllPersonalSpacesOverride: boolean;
    personalSpacesDefaultPersonalQuotaMaxFileSize: number;
    personalSpacesDefaultPersonalQuotaMaxFileSizeUnit: StorageUnit['label'] | string;
    sharedSpaceDefaultTotalAllocatedQuota: number;
    sharedSpaceDefaultTotalAllocatedQuotaUnit: StorageUnit['label'] | string;
    shared: boolean | undefined;
    sharedSpaceAllocatedQuota: number;
    sharedSpaceAllocatedQuotaUnit: StorageUnit['label'] | string;
    sharedSpaceMaxFileSizeQuota: number;
    sharedSpaceMaxFileSizeQuotaUnit: StorageUnit['label'] | string;
    maxFileSizeOverride: boolean;
    quotaOverride: boolean;
    quotaSpaceOverride: boolean;
    defaultQuotaOverride: boolean;
    defaultMaxFileSizeOverride: boolean;
  };
  allocationWithinTheCurrentDomain: {
    maintenance: boolean;
    sharedSpaceMaintenance: boolean;
    quota: number;
    quotaOverride: boolean;
    quotaUnit: StorageUnit['label'] | string;
    defaultAccountQuota: number;
    accountQuota: number;
    defaultAccountQuotaUnit: StorageUnit['label'] | string;
    accountQuotaOverride: boolean;
    accountQuotaUnit: StorageUnit['label'] | string;
    maxFileSize: number;
    maxFileSizeOverride: boolean;
    maxFileSizeUnit: StorageUnit['label'] | string;
    sharedSpaceAllocatedOverride: boolean;

    defaultMaxFileSize: number;
    defaultMaxFileSizeUnit: StorageUnit['label'] | string;
    personalSpacesAllocatedQuotaForAllPersonalSpaces: number;
    personalSpacesAllocatedQuotaForAllPersonalSpacesUnit: StorageUnit['label'] | string;
    personalSpacesAllocatedQuotaForAllPersonalSpacesOverride: boolean;
    defaultAccountQuotaOverride: boolean;
    defaultMaxFileSizeOverride: boolean;
  };
  saverCheck: boolean;
}>({
  domainQuotaAndUsedSpace: {
    quotaSpace: 0,
    quotaUnit: 'TB',
    maintenance: false,
    domainShared: false,
    domainSharedOverride: false,
    quotaOverride: false,
  },
  subdomainAllocationSettings: {
    quotaSpace: 0,
    quotaUnit: 'TB',
    quotaSpaceOverride: false,
    personalSpacesAllocatedQuotaForAllPersonalSpacesOverride: false,
    personalSpacesAllocatedQuotaForAllPersonalSpaces: 0,
    personalSpacesAllocatedQuotaForAllPersonalSpacesUnit: 'TB',
    personalSpacesDefaultPersonalQuotaMaxFileSize: 0,
    personalSpacesDefaultPersonalQuotaMaxFileSizeUnit: 'TB',
    sharedSpaceDefaultTotalAllocatedQuota: 0,
    sharedSpaceDefaultTotalAllocatedQuotaUnit: 'TB',
    shared: false,
    quotaOverride: false,
    defaultMaxFileSizeOverride: false,
    defaultQuotaOverride: false,
    maxFileSizeOverride: false,
    sharedSpaceAllocatedQuota: 0,
    sharedSpaceAllocatedQuotaUnit: 'TB',
    sharedSpaceMaxFileSizeQuota: 0,
    sharedSpaceMaxFileSizeQuotaUnit: 'TB',
  },
  allocationWithinTheCurrentDomain: {
    maintenance: false,
    quota: 0,
    quotaOverride: false,
    quotaUnit: 'TB',
    defaultAccountQuota: 0,
    defaultAccountQuotaUnit: 'TB',
    accountQuota: 0,
    accountQuotaOverride: false,
    accountQuotaUnit: 'TB',
    maxFileSize: 0,
    maxFileSizeOverride: false,
    maxFileSizeUnit: 'TB',
    sharedSpaceAllocatedOverride: false,
    sharedSpaceMaintenance: false,
    defaultMaxFileSize: 0,
    defaultMaxFileSizeUnit: 'TB',
    personalSpacesAllocatedQuotaForAllPersonalSpaces: 0,
    personalSpacesAllocatedQuotaForAllPersonalSpacesUnit: 'TB',
    personalSpacesAllocatedQuotaForAllPersonalSpacesOverride: false,
    defaultAccountQuotaOverride: false,
    defaultMaxFileSizeOverride: false,
  },
  saverCheck: false,
});

export default function useQuota() {
  // local data
  const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const domainStore = useDomainStore();
  const { currentDomain } = storeToRefs(domainStore);

  // methods
  async function getInformations(domainUuid: string) {
    try {
      domainQuotaUuid.value = await getQuotaUuid(domainUuid);
      const message = await getQuotaInformations(domainQuotaUuid.value.quota);
      Object.assign(domainQuotaInformations, message);
      _generateFormData(domainQuotaInformations);
      for (const [key] of Object.entries(domainQuotaInformations.containerUuids)) {
        const containerMessage = await getContainerInformations(domainQuotaInformations.containerUuids[key]);
        if (containerMessage.type === 'WORK_GROUP') {
          Object.assign(subdomainContainerInformations, containerMessage);
          _generateFormDataSubdomain(subdomainContainerInformations);
        } else if (containerMessage.type === 'USER') {
          Object.assign(allocationContainerInformations, containerMessage);
          _generateFormDataAllocationContainer(allocationContainerInformations);
        }
        if (domainQuotaInformations.parentDomain?.identifier) {
          parentDomainQuotaUuid.value = await getQuotaUuid(domainQuotaInformations.parentDomain?.identifier);
          const parent = await getQuotaInformations(parentDomainQuotaUuid.value.quota);
          Object.assign(parentDomainInformations, parent);
          for (const [key] of Object.entries(parentDomainInformations.containerUuids)) {
            const containerMessage = await getContainerInformations(parentDomainInformations.containerUuids[key]);
            if (containerMessage.type === 'WORK_GROUP') {
              Object.assign(parentSubdomainInformations, containerMessage);
            } else {
              Object.assign(parentAllocationInformations, containerMessage);
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
  }

  async function resetDomainQuotaInformation(domainUuid: string) {
    await getInformations(domainUuid);
  }

  async function saveQuota(domainUuid: string, successMessage: string) {
    try {
      await updateQuota(domainQuotaUuid.value.quota, _generateQuotaPayload());
      await updateSubdomainQuota(subdomainContainerInformations.uuid, _generateSubdomainPayload());
      await updateSubdomainQuota(allocationContainerInformations.uuid, _generateAllocationContainerPaypload());
      message.success(successMessage);
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
    resetDomainQuotaInformation(domainUuid);
  }

  function _generateFormData(quota: Quota) {
    form.domainQuotaAndUsedSpace.maintenance = quota.maintenance;
    form.domainQuotaAndUsedSpace.quotaSpace = byteTo(domainQuotaInformations.quota, undefined);
    form.domainQuotaAndUsedSpace.quotaUnit = find(domainQuotaInformations.quota);
    form.domainQuotaAndUsedSpace.domainShared = domainQuotaInformations.domainShared;
    form.domainQuotaAndUsedSpace.quotaOverride = domainQuotaInformations.quotaOverride;
    form.domainQuotaAndUsedSpace.domainSharedOverride = domainQuotaInformations.domainSharedOverride;
  }

  function _generateFormDataSubdomain(quota: QuotaContainer) {
    form.subdomainAllocationSettings.quotaOverride = quota.quotaOverride;
    form.subdomainAllocationSettings.shared = domainQuotaInformations.defaultDomainShared;
    form.subdomainAllocationSettings.quotaSpace = byteTo(domainQuotaInformations.defaultQuota, undefined);
    form.subdomainAllocationSettings.quotaUnit = find(domainQuotaInformations.defaultQuota);
    form.subdomainAllocationSettings.sharedSpaceDefaultTotalAllocatedQuota = byteTo(quota.defaultQuota, undefined);
    form.subdomainAllocationSettings.sharedSpaceDefaultTotalAllocatedQuotaUnit = find(quota.defaultQuota);
    form.subdomainAllocationSettings.maxFileSizeOverride = quota.maxFileSizeOverride;
    form.subdomainAllocationSettings.sharedSpaceAllocatedQuota = byteTo(quota.defaultQuota, undefined);
    form.subdomainAllocationSettings.sharedSpaceAllocatedQuotaUnit = find(quota.defaultQuota);
    form.subdomainAllocationSettings.personalSpacesDefaultPersonalQuotaMaxFileSize = byteTo(
      quota.defaultMaxFileSize,
      undefined
    );
    form.subdomainAllocationSettings.personalSpacesDefaultPersonalQuotaMaxFileSizeUnit = find(quota.defaultMaxFileSize);
    form.subdomainAllocationSettings.sharedSpaceMaxFileSizeQuota = byteTo(quota.maxFileSize, undefined);
    form.subdomainAllocationSettings.sharedSpaceMaxFileSizeQuotaUnit = find(quota.maxFileSize);
    form.subdomainAllocationSettings.defaultQuotaOverride = quota.defaultQuotaOverride;
    form.subdomainAllocationSettings.defaultMaxFileSizeOverride = quota.defaultMaxFileSizeOverride;
    form.subdomainAllocationSettings.personalSpacesAllocatedQuotaForAllPersonalSpaces = byteTo(quota.quota, undefined);
    form.subdomainAllocationSettings.personalSpacesAllocatedQuotaForAllPersonalSpacesUnit = find(quota.quota);
    form.allocationWithinTheCurrentDomain.sharedSpaceMaintenance = quota.maintenance;
  }

  function _generateFormDataAllocationContainer(quota: QuotaContainer) {
    form.allocationWithinTheCurrentDomain.maintenance = quota.maintenance;
    form.allocationWithinTheCurrentDomain.quota = byteTo(quota.quota, undefined);
    form.allocationWithinTheCurrentDomain.quotaUnit = find(quota.quota);
    form.allocationWithinTheCurrentDomain.quotaOverride = quota.quotaOverride;
    form.allocationWithinTheCurrentDomain.accountQuota = byteTo(quota.accountQuota, undefined);
    form.allocationWithinTheCurrentDomain.accountQuotaUnit = find(quota.accountQuota);
    form.allocationWithinTheCurrentDomain.defaultAccountQuota = byteTo(quota.defaultAccountQuota, undefined);
    form.allocationWithinTheCurrentDomain.defaultAccountQuotaUnit = find(quota.defaultAccountQuota);
    form.allocationWithinTheCurrentDomain.accountQuotaOverride = quota.accountQuotaOverride;
    form.allocationWithinTheCurrentDomain.maxFileSize = byteTo(quota.maxFileSize, undefined);
    form.allocationWithinTheCurrentDomain.maxFileSizeUnit = find(quota.maxFileSize);
    form.allocationWithinTheCurrentDomain.defaultMaxFileSize = byteTo(quota.defaultMaxFileSize, undefined);
    form.allocationWithinTheCurrentDomain.defaultMaxFileSizeUnit = find(quota.defaultMaxFileSize);
    form.allocationWithinTheCurrentDomain.maxFileSizeOverride = quota.maxFileSizeOverride;
    form.allocationWithinTheCurrentDomain.sharedSpaceAllocatedOverride = quota.quotaOverride;
    form.allocationWithinTheCurrentDomain.personalSpacesAllocatedQuotaForAllPersonalSpaces = byteTo(
      quota.defaultQuota,
      undefined
    );
    form.allocationWithinTheCurrentDomain.personalSpacesAllocatedQuotaForAllPersonalSpacesUnit = find(
      quota.defaultQuota
    );
    form.allocationWithinTheCurrentDomain.personalSpacesAllocatedQuotaForAllPersonalSpacesOverride =
      quota.defaultQuotaOverride;
    form.allocationWithinTheCurrentDomain.defaultAccountQuotaOverride = quota.defaultAccountQuotaOverride;
    form.allocationWithinTheCurrentDomain.defaultMaxFileSizeOverride = quota.defaultMaxFileSizeOverride;
  }

  function _generateQuotaPayload() {
    return {
      ...domainQuotaInformations,
      defaultQuota: toByte(form.subdomainAllocationSettings.quotaSpace, form.subdomainAllocationSettings.quotaUnit),
      maintenance: form.domainQuotaAndUsedSpace.maintenance,
      quota: toByte(form.domainQuotaAndUsedSpace.quotaSpace, form.domainQuotaAndUsedSpace.quotaUnit),
      quotaOverride: form.domainQuotaAndUsedSpace.quotaOverride,
      domainShared: form.domainQuotaAndUsedSpace.domainShared,
      domainSharedOverride: form.domainQuotaAndUsedSpace.domainSharedOverride,
    };
  }

  function _generateSubdomainPayload() {
    return {
      ...subdomainContainerInformations,
      defaultMaxFileSize: toByte(
        form.subdomainAllocationSettings.personalSpacesDefaultPersonalQuotaMaxFileSize,
        form.subdomainAllocationSettings.personalSpacesDefaultPersonalQuotaMaxFileSizeUnit
      ),
      defaultMaxFileSizeOverride: form.subdomainAllocationSettings.defaultMaxFileSizeOverride,
      defaultQuota: toByte(
        form.subdomainAllocationSettings.sharedSpaceDefaultTotalAllocatedQuota,
        form.subdomainAllocationSettings.sharedSpaceDefaultTotalAllocatedQuotaUnit
      ),
      defaultQuotaOverride: form.subdomainAllocationSettings.defaultQuotaOverride,
      maxFileSize: toByte(
        form.subdomainAllocationSettings.sharedSpaceMaxFileSizeQuota,
        form.subdomainAllocationSettings.sharedSpaceMaxFileSizeQuotaUnit
      ),
      maxFileSizeOverride: form.subdomainAllocationSettings.maxFileSizeOverride,
      modificationDate: subdomainContainerInformations.modificationDate,
      quota: toByte(
        form.subdomainAllocationSettings.personalSpacesAllocatedQuotaForAllPersonalSpaces,
        form.subdomainAllocationSettings.personalSpacesAllocatedQuotaForAllPersonalSpacesUnit
      ),
      quotaOverride: form.allocationWithinTheCurrentDomain.sharedSpaceAllocatedOverride,
      maintenance: form.allocationWithinTheCurrentDomain.sharedSpaceMaintenance,
    };
  }

  function _generateAllocationContainerPaypload() {
    return {
      ...allocationContainerInformations,
      maintenance: form.allocationWithinTheCurrentDomain.maintenance,
      quota: toByte(form.allocationWithinTheCurrentDomain.quota, form.allocationWithinTheCurrentDomain.quotaUnit),
      quotaOverride: form.allocationWithinTheCurrentDomain.quotaOverride,
      accountQuota: toByte(
        form.allocationWithinTheCurrentDomain.accountQuota,
        form.allocationWithinTheCurrentDomain.accountQuotaUnit
      ),
      accountQuotaOverride: form.allocationWithinTheCurrentDomain.accountQuotaOverride,
      maxFileSize: toByte(
        form.allocationWithinTheCurrentDomain.maxFileSize,
        form.allocationWithinTheCurrentDomain.maxFileSizeUnit
      ),
      maxFileSizeOverride: form.allocationWithinTheCurrentDomain.maxFileSizeOverride,
      defaultAccountQuota: toByte(
        form.allocationWithinTheCurrentDomain.defaultAccountQuota,
        form.allocationWithinTheCurrentDomain.defaultAccountQuotaUnit
      ),
      defaultAccountQuotaOverride: form.allocationWithinTheCurrentDomain.defaultAccountQuotaOverride,
      defaultMaxFileSize: toByte(
        form.allocationWithinTheCurrentDomain.defaultMaxFileSize,
        form.allocationWithinTheCurrentDomain.defaultMaxFileSizeUnit
      ),
      defaultMaxFileSizeOverride: form.allocationWithinTheCurrentDomain.defaultMaxFileSizeOverride,
      defaultQuota: toByte(
        form.allocationWithinTheCurrentDomain.personalSpacesAllocatedQuotaForAllPersonalSpaces,
        form.allocationWithinTheCurrentDomain.personalSpacesAllocatedQuotaForAllPersonalSpacesUnit
      ),
      defaultQuotaOverride:
        form.allocationWithinTheCurrentDomain.personalSpacesAllocatedQuotaForAllPersonalSpacesOverride,
    };
  }

  function defaultMaxiQuotaLogic() {
    if (
      toByte(form.domainQuotaAndUsedSpace.quotaSpace, form.domainQuotaAndUsedSpace.quotaUnit) >
      parentDomainInformations.quota
    ) {
      return true;
    }
    return false;
  }

  function defaultAllocatedMaxQuotaLogic() {
    if (
      toByte(form.allocationWithinTheCurrentDomain.quota, form.allocationWithinTheCurrentDomain.quotaUnit) >
      toByte(form.domainQuotaAndUsedSpace.quotaSpace, form.domainQuotaAndUsedSpace.quotaUnit)
    ) {
      return true;
    }
    return false;
  }

  function personalSpaceQuotaLogic() {
    if (isSubdomain()) {
      return false;
    }

    if (
      toByte(
        form.allocationWithinTheCurrentDomain.personalSpacesAllocatedQuotaForAllPersonalSpaces,
        form.allocationWithinTheCurrentDomain.personalSpacesAllocatedQuotaForAllPersonalSpacesUnit
      ) > toByte(form.subdomainAllocationSettings.quotaSpace, form.subdomainAllocationSettings.quotaUnit)
    ) {
      return true;
    }
    return false;
  }

  function personalSpaceQuotaPerUserLogic() {
    if (isSubdomain()) {
      return false;
    }

    if (
      toByte(
        form.allocationWithinTheCurrentDomain.defaultAccountQuota,
        form.allocationWithinTheCurrentDomain.defaultAccountQuotaUnit
      ) >
      toByte(
        form.allocationWithinTheCurrentDomain.personalSpacesAllocatedQuotaForAllPersonalSpaces,
        form.allocationWithinTheCurrentDomain.personalSpacesAllocatedQuotaForAllPersonalSpacesUnit
      )
    ) {
      return true;
    }
    return false;
  }

  function personalSpaceMaxSizeLogic() {
    if (isSubdomain()) {
      return false;
    }

    if (
      toByte(
        form.allocationWithinTheCurrentDomain.defaultMaxFileSize,
        form.allocationWithinTheCurrentDomain.defaultMaxFileSizeUnit
      ) >
      toByte(
        form.allocationWithinTheCurrentDomain.defaultAccountQuota,
        form.allocationWithinTheCurrentDomain.defaultAccountQuotaUnit
      )
    ) {
      return true;
    }

    return false;
  }

  function maxQuotaLogic() {
    if (isSubdomain()) {
      return false;
    }
    if (
      toByte(form.subdomainAllocationSettings.quotaSpace, form.subdomainAllocationSettings.quotaUnit) >
      toByte(form.domainQuotaAndUsedSpace.quotaSpace, form.domainQuotaAndUsedSpace.quotaUnit)
    ) {
      return true;
    }
    return false;
  }

  function isExceeded(useSpace: number, quota: number) {
    return useSpace >= quota;
  }

  function totalSharedSpaceQuotaLogic() {
    if (isSubdomain()) {
      return false;
    }

    if (
      toByte(
        form.subdomainAllocationSettings.sharedSpaceDefaultTotalAllocatedQuota,
        form.subdomainAllocationSettings.sharedSpaceDefaultTotalAllocatedQuotaUnit
      ) > toByte(form.allocationWithinTheCurrentDomain.quota, form.allocationWithinTheCurrentDomain.quotaUnit)
    ) {
      return true;
    }

    return false;
  }

  function shareSpaceDefaultMaxSizeLogic() {
    if (isSubdomain()) {
      return false;
    }

    if (
      toByte(
        form.subdomainAllocationSettings.personalSpacesDefaultPersonalQuotaMaxFileSize,
        form.subdomainAllocationSettings.personalSpacesDefaultPersonalQuotaMaxFileSizeUnit
      ) >
      toByte(
        form.subdomainAllocationSettings.sharedSpaceDefaultTotalAllocatedQuota,
        form.subdomainAllocationSettings.sharedSpaceDefaultTotalAllocatedQuotaUnit
      )
    ) {
      return true;
    }

    return false;
  }

  function personalAllocatedQuotaLogic() {
    if (
      toByte(form.allocationWithinTheCurrentDomain.quota, form.allocationWithinTheCurrentDomain.quotaUnit) <
      toByte(form.allocationWithinTheCurrentDomain.accountQuota, form.allocationWithinTheCurrentDomain.accountQuotaUnit)
    ) {
      return true;
    }
    return false;
  }

  function personalAllocatedMaxFileSizeLogic() {
    if (
      toByte(form.allocationWithinTheCurrentDomain.maxFileSize, form.allocationWithinTheCurrentDomain.maxFileSizeUnit) >
      toByte(form.allocationWithinTheCurrentDomain.accountQuota, form.allocationWithinTheCurrentDomain.accountQuotaUnit)
    ) {
      return true;
    }
    return false;
  }

  function totalSharedSpaceAllocatedQuotaLogic() {
    if (
      toByte(
        form.subdomainAllocationSettings.personalSpacesAllocatedQuotaForAllPersonalSpaces,
        form.subdomainAllocationSettings.personalSpacesAllocatedQuotaForAllPersonalSpacesUnit
      ) > toByte(form.domainQuotaAndUsedSpace.quotaSpace, form.domainQuotaAndUsedSpace.quotaUnit)
    ) {
      return true;
    }
    return false;
  }

  function sharedSpaceMaxFileSizeLogic() {
    if (
      toByte(
        form.subdomainAllocationSettings.sharedSpaceMaxFileSizeQuota,
        form.subdomainAllocationSettings.sharedSpaceMaxFileSizeQuotaUnit
      ) >
      toByte(
        form.subdomainAllocationSettings.personalSpacesAllocatedQuotaForAllPersonalSpaces,
        form.subdomainAllocationSettings.personalSpacesAllocatedQuotaForAllPersonalSpacesUnit
      )
    ) {
      return true;
    }
    return false;
  }

  function isSubdomain() {
    return currentDomain.value.type === 'SUBDOMAIN' || currentDomain.value.type === 'GUESTDOMAIN';
  }

  watchEffect(() => {
    if (
      defaultMaxiQuotaLogic() ||
      personalSpaceQuotaPerUserLogic() ||
      personalSpaceMaxSizeLogic() ||
      personalSpaceQuotaLogic() ||
      maxQuotaLogic() ||
      totalSharedSpaceQuotaLogic() ||
      shareSpaceDefaultMaxSizeLogic() ||
      defaultAllocatedMaxQuotaLogic() ||
      personalAllocatedQuotaLogic() ||
      personalAllocatedMaxFileSizeLogic() ||
      totalSharedSpaceAllocatedQuotaLogic() ||
      sharedSpaceMaxFileSizeLogic()
    ) {
      form.saverCheck = true;
    } else {
      form.saverCheck = false;
    }
  });

  return {
    form,
    domainQuotaInformations,
    parentDomainInformations,
    subdomainContainerInformations,
    allocationContainerInformations,
    saveQuota,
    isExceeded,
    maxQuotaLogic,
    getInformations,
    defaultMaxiQuotaLogic,
    personalSpaceQuotaLogic,
    personalSpaceMaxSizeLogic,
    resetDomainQuotaInformation,
    personalSpaceQuotaPerUserLogic,
    parentSubdomainInformations,
    totalSharedSpaceQuotaLogic,
    parentAllocationInformations,
    shareSpaceDefaultMaxSizeLogic,
    defaultAllocatedMaxQuotaLogic,
    personalAllocatedQuotaLogic,
    totalSharedSpaceAllocatedQuotaLogic,
    sharedSpaceMaxFileSizeLogic,
    personalAllocatedMaxFileSizeLogic,
    isSubdomain,
  };
}
