import { reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import { APIError } from '@/core/types/APIError';
import { getQuotaInformations, getQuotaUuid, switchMaintenanceMode } from '../../quota/services/quota-api';
import Quota, { EMPTY_QUOTA } from '../../quota/types/Quota';

const domainQuotaInformations = reactive<Quota>({ ...EMPTY_QUOTA });
const domainQuotaUuid = ref();

export default function useQuota() {
  async function getInformations(domainUuid: string) {
    try {
      domainQuotaUuid.value = await getQuotaUuid(domainUuid);
      const message = await getQuotaInformations(domainQuotaUuid.value.quota);
      Object.assign(domainQuotaInformations, message);
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
  }
  const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  function niceBytes(x: any) {
    let l = 0,
      n = parseInt(x, 10) || 0;

    while (n >= 1024 && ++l) {
      n = n / 1024;
    }

    return n.toFixed(1) + ' ' + units[l];
  }

  async function switchMaintenance() {
    if (domainQuotaInformations.maintenance === false) {
      try {
        await switchMaintenanceMode(domainQuotaUuid.value.quota, switchIntoTrue());
      } catch (error) {
        if (error instanceof APIError) {
          message.error(error.getMessage());
        }
      }
    } else {
      try {
        await switchMaintenanceMode(domainQuotaUuid.value.quota, switchIntoFalse());
      } catch (error) {
        if (error instanceof APIError) {
          message.error(error.getMessage());
        }
      }
    }
  }

  function switchIntoFalse() {
    return {
      creationDate: domainQuotaInformations.creationDate,
      currentValueForSubdomains: domainQuotaInformations.currentValueForSubdomains,
      defaultDomainShared: domainQuotaInformations.defaultDomainShared,
      defaultDomainSharedOverride: domainQuotaInformations.defaultDomainSharedOverride,
      defaultQuota: domainQuotaInformations.defaultQuota,
      defaultQuotaOverride: domainQuotaInformations.defaultDomainSharedOverride,
      maintenance: false,
      modificationDate: domainQuotaInformations.modificationDate,
      quota: domainQuotaInformations.quota,
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
    };
  }
  function switchIntoTrue() {
    return {
      creationDate: domainQuotaInformations.creationDate,
      currentValueForSubdomains: domainQuotaInformations.currentValueForSubdomains,
      defaultDomainShared: domainQuotaInformations.defaultDomainShared,
      defaultDomainSharedOverride: domainQuotaInformations.defaultDomainSharedOverride,
      defaultQuota: domainQuotaInformations.defaultQuota,
      defaultQuotaOverride: domainQuotaInformations.defaultDomainSharedOverride,
      maintenance: true,
      modificationDate: domainQuotaInformations.modificationDate,
      quota: domainQuotaInformations.quota,
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
    };
  }

  function usedSpaceNoteInformation(x: any) {
    let l = 0,
      n = parseInt(x, 10) || 0;

    while (n >= 1024 && ++l) {
      n = n / 1024;
    }

    return n.toFixed(1);
  }

  return {
    getInformations,
    niceBytes,
    switchMaintenance,
    domainQuotaInformations,
    usedSpaceNoteInformation,
  };
}
