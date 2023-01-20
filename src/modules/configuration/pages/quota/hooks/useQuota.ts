import { reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import { APIError } from '@/core/types/APIError';
import { getQuotaInformations, getQuotaUuid, switchMaintenanceMode } from '../services/quota-api';
import Quota, { EMPTY_QUOTA } from '../types/Quota';
import { getSizeInUnit } from '@/core/utils/unitStorage';
import { Unit } from '@/core/types/Unit';

const domainQuotaInformations = reactive<Quota>({ ...EMPTY_QUOTA });
const domainQuotaUuid = ref();
const form = reactive<{
  quotaSpace: number | string;
  quotaUnit: Unit | string | undefined;
  maintenance: boolean | undefined;
}>({
  quotaSpace: 1000,
  quotaUnit: undefined,
  maintenance: false,
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
      _generateFormData(domainQuotaInformations);
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

  async function switchMaintenance() {
    if (domainQuotaInformations.maintenance === false) {
      try {
        await switchMaintenanceMode(domainQuotaUuid.value.quota, _switchIntoTrue());
      } catch (error) {
        if (error instanceof APIError) {
          message.error(error.getMessage());
        }
      }
    } else {
      try {
        await switchMaintenanceMode(domainQuotaUuid.value.quota, _switchIntoFalse());
      } catch (error) {
        if (error instanceof APIError) {
          message.error(error.getMessage());
        }
      }
    }
  }

  function _switchIntoFalse() {
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

  function _switchIntoTrue() {
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

  function _generateFormData(quota: Quota) {
    form.maintenance = quota.maintenance;
    form.quotaSpace = getSizeInUnit(quota.quota, 'GB', 2);
    form.quotaUnit = { name: 'GB', value: 'GB', factor: 9 };
  }

  return {
    form,
    domainQuotaInformations,
    niceBytes,
    getInformations,
    switchMaintenance,
    resetDomainQuotaInformation,
  };
}
