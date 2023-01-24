import { reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import { APIError } from '@/core/types/APIError';
import { getQuotaInformations, getQuotaUuid, updateQuota } from '../services/quota-api';
import Quota, { EMPTY_QUOTA } from '../types/Quota';
import { find, byteTo, toByte } from '@/core/utils/unitStorage';

const domainQuotaInformations = reactive<Quota>({ ...EMPTY_QUOTA });
const domainQuotaUuid = ref();
const form = reactive<{
  domain_quota_and_used_space: {
    quotaSpace: number | string;
    quotaUnit: string;
    maintenance: boolean | undefined;
  };
}>({
  domain_quota_and_used_space: {
    quotaSpace: byteTo(domainQuotaInformations.quota, undefined, false),
    quotaUnit: find(domainQuotaInformations.quota),
    maintenance: false,
  },
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

  async function saveQuota(domainUuid: string) {
    try {
      await updateQuota(domainQuotaUuid.value.quota, savePaypload());
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
    resetDomainQuotaInformation(domainUuid);
  }

  function _generateFormData(quota: Quota) {
    form.domain_quota_and_used_space.maintenance = quota.maintenance;
    form.domain_quota_and_used_space.quotaSpace = byteTo(domainQuotaInformations.quota, undefined, false);
    form.domain_quota_and_used_space.quotaUnit = find(domainQuotaInformations.quota);
  }

  function savePaypload() {
    return {
      creationDate: domainQuotaInformations.creationDate,
      currentValueForSubdomains: domainQuotaInformations.currentValueForSubdomains,
      defaultDomainShared: domainQuotaInformations.defaultDomainShared,
      defaultDomainSharedOverride: domainQuotaInformations.defaultDomainSharedOverride,
      defaultQuota: domainQuotaInformations.defaultQuota,
      defaultQuotaOverride: domainQuotaInformations.defaultDomainSharedOverride,
      maintenance: form.domain_quota_and_used_space.maintenance,
      modificationDate: domainQuotaInformations.modificationDate,
      quota: toByte(form.domain_quota_and_used_space.quotaSpace, form.domain_quota_and_used_space.quotaUnit, false),
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

  return {
    form,
    domainQuotaInformations,
    niceBytes,
    getInformations,
    saveQuota,
    resetDomainQuotaInformation,
  };
}
