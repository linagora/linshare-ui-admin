import { reactive, ref, computed, watch } from 'vue';
import { DEFAULT_PAGE_SIZE } from '@/core/constants';
import { DomainPolicy } from '../types/DomainPolicy';
import { message } from 'ant-design-vue';
import { APIError } from '@/core/types/APIError';
import { STATUS } from '@/core/types/Status';
import { useI18n } from 'vue-i18n';
import {
  updateDomainPolicy,
  getDomainPolicyList,
  assignDomainPolicy,
  createDomainPolicy,
  deleteDomainPolicy,
  getDomainPolicyDetail,
} from '../services/domain-policies-api';
import { storeToRefs } from 'pinia';
import { useDomainStore } from '@/modules/domain/store';
import Domain from '@/core/types/Domain';
import { useLocalStorage } from '@vueuse/core';
import { useRouter } from 'vue-router';
import { DOMAIN_POLICIES_ROUTE_NAMES } from '../router';
import { EMAIL_DEFAULT_UUID } from '@/core/constants/emails';

const activeDomainPolicy = useLocalStorage<DomainPolicy>('configuration-domain-policies', {} as DomainPolicy);
const activeDomainPolicyForm = ref<Partial<DomainPolicy>>({});
const defaultDomainPolicyForm = ref<Partial<DomainPolicy>>({});
const selectedDomainPolicies = ref<DomainPolicy[]>();

const list = ref<DomainPolicy[]>([]);
const filterText = ref('');
const status = ref(STATUS.LOADING);
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: DEFAULT_PAGE_SIZE,
});
const loading = ref(false);

const DomainPolicyUuid = reactive<{
  uuid: string;
}>({
  uuid: '',
});

const modal = reactive<{
  type:
    | 'CREATE_DOMAIN_POLICY'
    | 'ASSIGN_DOMAIN_POLICY'
    | 'DELETE_DOMAIN_POLICY'
    | 'DELETE_DOMAIN_POLICY'
    | 'DELETE_DOMAIN_POLICY_FAIL';
  visible: boolean;
  multipleDeleteResponse?: {
    total: number;
    totalSuccess: number;
    totalFail: number;
    totalAssignCases: number;
    totalUnAuthoCases: number;
  };
}>({
  type: 'CREATE_DOMAIN_POLICY',
  visible: false,
});

const filteredList = computed(() =>
  list.value.filter(
    (domainPolicy: DomainPolicy) =>
      domainPolicy?.label?.toLowerCase().includes(filterText.value.toLowerCase()) ||
      domainPolicy?.description?.toLowerCase().includes(filterText.value.toLowerCase())
  )
);
const filteredListByPage = computed(() => {
  const firstIndex = (pagination.current - 1) * pagination.pageSize;
  const lastIndex = pagination.current * pagination.pageSize;
  return filteredList.value.slice(firstIndex, lastIndex);
});

export default function useDomainPolicies() {
  // composable
  const { t } = useI18n();
  const router = useRouter();
  const { currentDomain } = storeToRefs(useDomainStore());

  watch(filteredList, async (newVal) => {
    pagination.total = newVal.length;
    pagination.current =
      pagination.current * pagination.pageSize > pagination.total
        ? Math.floor(pagination.total / pagination.pageSize) || 1
        : pagination.current;
  });

  // computed
  const languageOptions = computed(() => {
    return [
      { label: t(`LOCALE.ENGLISH`), value: 'ENGLISH' },
      { label: t(`LOCALE.FRENCH`), value: 'FRENCH' },
      { label: t(`LOCALE.RUSSIAN`), value: 'RUSSIAN' },
      { label: t(`LOCALE.VIETNAMESE`), value: 'VIETNAMESE' },
    ];
  });

  //methods
  function onCheckDefaultDomainPolicy(email: DomainPolicy) {
    return EMAIL_DEFAULT_UUID.CONFIGURATION === email.uuid;
  }
  function onCloseModal() {
    modal.visible = false;
  }

  function onCreateDomainPolicy(email: DomainPolicy) {
    activeDomainPolicy.value = email;
    modal.type = 'CREATE_DOMAIN_POLICY';
    modal.visible = true;
  }

  function onDeleteDomainPolicies() {
    modal.type = 'DELETE_DOMAIN_POLICY';
    modal.visible = true;
  }

  function onDeleteDomainPoliciesFail(response: {
    total: number;
    totalSuccess: number;
    totalFail: number;
    totalAssignCases: number;
    totalUnAuthoCases: number;
  }) {
    modal.type = 'DELETE_DOMAIN_POLICY_FAIL';
    modal.visible = true;
    modal.multipleDeleteResponse = response;
  }

  async function fetchDomainPolicy(onlyCurrentDomain = true) {
    status.value = STATUS.LOADING;
    try {
      const messages = await getDomainPolicyList(currentDomain.value.uuid, onlyCurrentDomain);
      status.value = STATUS.SUCCESS;
      list.value = messages;
    } catch (error) {
      status.value = STATUS.ERROR;

      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
  }

  function isAssigned(DomainPolicyUuid: string, currentDomainDomainPolicyUuid: string | undefined) {
    if (DomainPolicyUuid === currentDomainDomainPolicyUuid) {
      return true;
    }
    return false;
  }

  function onAssignDomainPolicy(DomainPolicy: DomainPolicy) {
    activeDomainPolicy.value = DomainPolicy;
    modal.type = 'ASSIGN_DOMAIN_POLICY';
    modal.visible = true;
  }

  function onDeleteDomainPolicy(DomainPolicy: DomainPolicy) {
    activeDomainPolicy.value = DomainPolicy;
    DomainPolicyUuid.uuid = DomainPolicy.uuid;
    modal.type = 'DELETE_DOMAIN_POLICY';
    modal.visible = true;
  }

  function onEditDomainPolicy(record: DomainPolicy) {
    activeDomainPolicy.value = record;
    router.push({ name: DOMAIN_POLICIES_ROUTE_NAMES.POLICY_DETAIL, params: { id: record?.uuid } });
  }

  async function handleAssignDomainPolicy(currentDomain: Domain) {
    try {
      if (!activeDomainPolicy?.value) {
        return false;
      }

      status.value = STATUS.LOADING;
      await assignDomainPolicy(currentDomain.uuid, activeDomainPolicy.value?.uuid);
      message.success(t('EMAIL_TEMPLATES.ASSIGN_MODAL.ASSIGN_SUCCESS'));
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
      return false;
    } finally {
      status.value = STATUS.SUCCESS;
    }
  }

  async function handleCreateDomainPolicy(payload: {
    accessPolicy: {
      rules: {
        type: 'ALLOW' | 'ALLOW_ALL' | 'DENY' | 'DENY_ALL';
        domain: Domain;
      }[];
    };
    label: string;
    description: string;
  }) {
    try {
      loading.value = true;
      await createDomainPolicy(payload);
      message.success(t('EMAIL_TEMPLATES.CREATE_MODAL.CREATE_SUCCESS'));
      return true;
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
      return false;
    } finally {
      loading.value = false;
    }
  }
  async function handleDeleteDomainPolicy(activeDomainPolicy: DomainPolicy) {
    try {
      if (!activeDomainPolicy) {
        return false;
      }
      loading.value = true;
      await deleteDomainPolicy(activeDomainPolicy);
      return true;
    } catch (error) {
      if (error instanceof APIError) {
        if (error.errorCode === 16666) {
          message.error(t('DOMAIN_POLICY.DELETE_MODAL.DELETE_ERROR_ASSIGNED'));
        } else if (error.errorCode === 166678) {
          message.error(t('DOMAIN_POLICY.DELETE_MODAL.DELETE_ERROR_UNAUTHORIZED'));
        } else {
          message.error(error.getMessage());
        }
      }
    } finally {
      loading.value = false;
    }
  }

  async function handleDeleteDomainPolicies() {
    try {
      if (!selectedDomainPolicies?.value?.length) {
        message.error(t('MIME_POLICIES.DELETE_MODAL.DELETE_MODAL_EMPTY'));
        return {
          total: selectedDomainPolicies?.value?.length,
          totalSuccess: 0,
          totalFail: selectedDomainPolicies?.value?.length,
          totalAssignCases: 0,
          totalUnAuthoCases: 0,
        };
      }

      loading.value = true;
      const deletePromises = selectedDomainPolicies.value?.map((item) => {
        return deleteDomainPolicy({ uuid: item?.uuid });
      });
      if (!deletePromises) {
        return {
          total: selectedDomainPolicies?.value?.length,
          totalSuccess: 0,
          totalFail: selectedDomainPolicies?.value?.length,
          totalAssignCases: 0,
          totalUnAuthoCases: 0,
        };
      }

      return await Promise.allSettled(deletePromises).then((results) => {
        return {
          total: selectedDomainPolicies?.value?.length,
          totalSuccess: results.filter((item) => item.status === 'fulfilled')?.length ?? 0,
          totalFail: results.filter((item) => item.status === 'rejected')?.length ?? 0,
          totalAssignCases:
            results.filter((item) => item.status === 'rejected' && item.reason?.errorCode === 16666)?.length ?? 0,
          totalUnAuthoCases:
            results.filter((item) => item.status === 'rejected' && item.reason?.errorCode === 166678)?.length ?? 0,
        };
      });
    } catch (error) {
      return {
        total: selectedDomainPolicies?.value?.length,
        totalSuccess: 0,
        totalFail: selectedDomainPolicies?.value?.length,
        totalAssignCases: 0,
        totalUnAuthoCases: 0,
      };
    } finally {
      loading.value = false;
    }
  }
  async function handleGetDomainPolicyDetail(uuid: string) {
    status.value = STATUS.LOADING;
    try {
      const messages = await getDomainPolicyDetail(uuid, currentDomain.value.uuid);
      status.value = STATUS.SUCCESS;
      activeDomainPolicy.value = messages;
      activeDomainPolicy.value.selectLanguage = 'ENGLISH';

      activeDomainPolicyForm.value = {
        uuid: messages?.uuid ?? activeDomainPolicy.value?.uuid,
        name: messages?.name,
        visible: messages?.visible,
        mailLayout: messages?.mailLayout,
        selectLanguage: activeDomainPolicy.value.selectLanguage,
      };
      defaultDomainPolicyForm.value = { ...activeDomainPolicyForm.value };
    } catch (error) {
      status.value = STATUS.ERROR;

      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
  }

  async function handleUpdateDomainPolicy(payload: DomainPolicy) {
    try {
      await updateDomainPolicy(payload);
      message.success(t('EMAIL_TEMPLATES.EDIT_FORM.UPDATE_SUCCESS'));
    } catch (error) {
      if (error instanceof APIError) {
        if (error.errorCode === 1000) {
          message.error(t('ERRORS.MAIL_CONFIGURATION.1000'));
        } else {
          message.error(error.getMessage());
        }
      }
      return [];
    }
  }

  function handleResetDomainPolicy() {
    activeDomainPolicyForm.value = JSON.parse(JSON.stringify(defaultDomainPolicyForm.value));
  }
  function resetSelectDomainPolicy() {
    selectedDomainPolicies.value = [];
  }

  return {
    list,
    modal,
    status,
    loading,
    pagination,
    filterText,
    filteredList,
    activeDomainPolicy,
    activeDomainPolicyForm,
    filteredListByPage,
    selectedDomainPolicies,
    languageOptions,
    isAssigned,
    onCloseModal,
    fetchDomainPolicy,
    onEditDomainPolicy,
    onDeleteDomainPolicy,
    onAssignDomainPolicy,
    onCreateDomainPolicy,
    onDeleteDomainPolicies,
    resetSelectDomainPolicy,
    handleResetDomainPolicy,
    handleUpdateDomainPolicy,
    handleAssignDomainPolicy,
    handleDeleteDomainPolicy,
    handleCreateDomainPolicy,
    handleDeleteDomainPolicies,
    onDeleteDomainPoliciesFail,
    onCheckDefaultDomainPolicy,
    handleGetDomainPolicyDetail,
  };
}
