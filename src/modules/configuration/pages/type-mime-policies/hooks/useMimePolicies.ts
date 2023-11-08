import { reactive, ref, computed, watch } from 'vue';
import { DEFAULT_PAGE_SIZE } from '@/core/constants';
import { message } from 'ant-design-vue';
import { APIError } from '@/core/types/APIError';
import {
  deleteMimePolicy,
  getMimePolicy,
  enableAllTypeInMimePolicy,
  disableAllTypeInMimePolicy,
  updateMimeType,
  updateMimePolicy,
  getMimePolicies,
} from '../services/mime-policies-api';
import { MimePolicy, MimeType } from '../types/MimeType';
import { STATUS } from '@/core/types/Status';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/modules/auth/store';
import { assignMimePolicy } from '../services/mime-policies-api';
import { ACCOUNT_ROLE } from '@/modules/user/types/User';
import { useDomainStore } from '@/modules/domain/store';
import { CONFIGURATION_MIME_POLICIES_ROUTE_NAMES } from '@/modules/configuration/pages/type-mime-policies/router';
import { useRoute, useRouter } from 'vue-router';
import { useLocalStorage } from '@vueuse/core';
import Domain from '@/core/types/Domain';

const activeMimePolicy = useLocalStorage<MimePolicy>(
  'configuration-type-mime-policies-activeMimePolicy',
  {} as MimePolicy
);
const selectedMimePolicies = ref<MimePolicy[]>();
const modal = reactive<{
  type: 'DELETE_MIME_MODAL' | 'DELETE_MIME_POLICIES_MODAL' | 'DELETE_MIME_POLICIES_FAIL_MODAL';
  visible: boolean;
}>({
  type: 'DELETE_MIME_MODAL',
  visible: false,
});

const assignModal = reactive<{
  visible: boolean;
}>({
  visible: false,
});

const list = ref<MimePolicy[]>([]);
const filterText = ref('');
const status = ref(STATUS.LOADING);
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: DEFAULT_PAGE_SIZE,
});

const filteredList = computed(() =>
  list.value.filter(
    (mime) =>
      mime.name.toLowerCase().includes(filterText.value.toLowerCase()) ||
      mime.domainName?.toLowerCase().includes(filterText.value.toLowerCase())
  )
);
const filteredListByPage = computed(() => {
  const firstIndex = (pagination.current - 1) * pagination.pageSize;
  const lastIndex = pagination.current * pagination.pageSize;
  return filteredList.value.slice(firstIndex, lastIndex);
});

export default function useMimesPolicies() {
  const { t } = useI18n();
  const { loggedUserRole } = storeToRefs(useAuthStore());
  const { getDomainsList, currentDomain } = storeToRefs(useDomainStore());
  const router = useRouter();
  const route = useRoute();

  // data
  const loading = ref(false);

  //hooks
  watch(filteredList, async (newVal) => {
    pagination.total = newVal.length;
  });

  function onCloseModal() {
    modal.visible = false;
  }

  function onCloseAssignModal() {
    assignModal.visible = false;
  }

  function onEditMimePolicy(mime: MimePolicy) {
    activeMimePolicy.value = mime;

    router.push({
      name: CONFIGURATION_MIME_POLICIES_ROUTE_NAMES.DETAIL,
      params: {
        domainUuid: currentDomain.value.uuid,
        mimePolicyUuid: activeMimePolicy.value?.uuid,
      },
    });
  }

  function onDeleteMimePolicy(mime: MimePolicy) {
    activeMimePolicy.value = mime;
    modal.type = 'DELETE_MIME_MODAL';
    modal.visible = true;
  }

  function onAssignMimePolicy(mime: MimePolicy) {
    activeMimePolicy.value = mime;
    assignModal.visible = true;
  }

  async function handleAssignMimePolicy(currentDomain: Domain) {
    try {
      if (!activeMimePolicy?.value) {
        return false;
      }
      loading.value = true;
      await assignMimePolicy(currentDomain.uuid, activeMimePolicy.value?.uuid);
      message.success(t('MIME_POLICIES.ASSIGN_MODAL.ASSIGN_SUCCESS'));
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
      return false;
    } finally {
      loading.value = false;
    }
  }

  function onDeleteMimePolicies() {
    modal.type = 'DELETE_MIME_POLICIES_MODAL';
    modal.visible = true;
  }

  function onShowDeleteMimePoliciesFail() {
    modal.type = 'DELETE_MIME_POLICIES_FAIL_MODAL';
    modal.visible = true;
  }

  async function handleDeleteMimePolicy() {
    try {
      if (!activeMimePolicy?.value) {
        message.error(t('MIME_POLICIES.DELETE_MODAL.DELETE_MODAL_EMPTY'));
        return false;
      }

      loading.value = true;
      const response = await deleteMimePolicy(activeMimePolicy.value?.uuid);

      if (response?.uuid) {
        message.success(t('MIME_POLICIES.DELETE_MODAL.DELETE_SUCCESS'));
        return true;
      }

      return false;
    } catch (error) {
      if (error instanceof APIError) {
        message.error(t('MIME_POLICIES.DELETE_MODAL.DELETE_SINGLE_FAIL'));
      }
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function handleDeleteMimePolicies() {
    try {
      if (!selectedMimePolicies?.value?.length) {
        message.error(t('MIME_POLICIES.DELETE_MODAL.DELETE_MODAL_EMPTY'));
        return false;
      }

      loading.value = true;
      const deletePromises = selectedMimePolicies.value?.map((item) => {
        return deleteMimePolicy(item?.uuid);
      });
      if (!deletePromises) {
        return;
      }
      const responses = await Promise.all(deletePromises);

      if (responses) {
        message.success(t('MIME_POLICIES.DELETE_MODAL.DELETE_SUCCESS'));
        return true;
      }

      return false;
    } catch (error) {
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function getMimePoliciesList(domainUuid: string) {
    status.value = STATUS.LOADING;
    try {
      const mimes = await getMimePolicies(domainUuid, false);
      list.value = mimes.map((item) => {
        return {
          ...item,
          assigned: isAssigned(item.uuid, currentDomain?.value?.mimePolicy?.uuid),
        };
      });
      status.value = STATUS.SUCCESS;
      return;
    } catch (error) {
      status.value = STATUS.ERROR;
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    } finally {
      clearSelectedMimePolicies();
    }
  }

  async function handleGetMimePolicy(mimePolicyUuid: string) {
    status.value = STATUS.LOADING;
    try {
      const mimes = await getMimePolicy(mimePolicyUuid);
      activeMimePolicy.value = mimes;
      status.value = STATUS.SUCCESS;
      return;
    } catch (error) {
      status.value = STATUS.ERROR;
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
  }

  async function enableAllMimeTypesInMimePolicy(mimePolicyUuid: string) {
    status.value = STATUS.LOADING;
    try {
      const mimes = await enableAllTypeInMimePolicy(mimePolicyUuid);
      activeMimePolicy.value = mimes;
      status.value = STATUS.SUCCESS;
      message.success(t('MIME_POLICIES.UPDATE_MIME_TYPE_SUCCESS', { name: activeMimePolicy.value?.name }));
      return;
    } catch (error) {
      status.value = STATUS.ERROR;
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
  }

  async function disableAllMimeTypesInMimePolicy(mimePolicyUuid: string) {
    status.value = STATUS.LOADING;
    try {
      const mimes = await disableAllTypeInMimePolicy(mimePolicyUuid);
      activeMimePolicy.value = mimes;
      status.value = STATUS.SUCCESS;
      message.success(t('MIME_POLICIES.UPDATE_MIME_TYPE_SUCCESS', { name: activeMimePolicy.value?.name }));
      return;
    } catch (error) {
      status.value = STATUS.ERROR;
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
  }

  async function handleUpdateMimeType(mimeType: MimeType) {
    status.value = STATUS.LOADING;
    try {
      const mimes = await updateMimeType(mimeType);
      status.value = STATUS.SUCCESS;
      if (mimes) {
        message.success(t('MIME_POLICIES.UPDATE_MIME_TYPE_SUCCESS', { name: mimeType.mimeType }));
        return;
      }
    } catch (error) {
      status.value = STATUS.ERROR;
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
  }

  function isAssigned(MimeTypeUuid: string, currentDomainMimeTypeUuid: string | undefined) {
    if (MimeTypeUuid === currentDomainMimeTypeUuid) {
      return true;
    }
    return false;
  }

  function isEditable(domainUuid: string, currentDomainUuid: string | undefined) {
    if (domainUuid !== currentDomainUuid) {
      return true;
    }
    return false;
  }

  function clearSelectedMimePolicies() {
    selectedMimePolicies.value = [];
  }

  function checkingMimePolicyDomainAuthorized(record: MimePolicy | undefined) {
    if (!record) {
      return false;
    }
    if (loggedUserRole.value === ACCOUNT_ROLE.SUPERADMIN) {
      return true;
    } else {
      return (
        getDomainsList.value.some((item) => {
          return item.uuid === record.domainId;
        }) && loggedUserRole?.value === ACCOUNT_ROLE.ADMIN
      );
    }
  }

  async function handleUpdateMimePolicy(payload: MimePolicy) {
    loading.value = true;
    try {
      const mimes = await updateMimePolicy(payload);
      if (mimes) {
        message.success(t('MIME_POLICIES.UPDATE_MIME_TYPE_SUCCESS', { name: payload.name }));
        return true;
      }
      return false;
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
      return false;
    } finally {
      loading.value = false;
    }
  }

  return {
    isAssigned,
    assignModal,
    handleAssignMimePolicy,
    isEditable,
    onAssignMimePolicy,
    onCloseModal,
    onEditMimePolicy,
    onDeleteMimePolicy,
    handleGetMimePolicy,
    getMimePoliciesList,
    handleUpdateMimeType,
    onDeleteMimePolicies,
    handleUpdateMimePolicy,
    handleDeleteMimePolicy,
    handleDeleteMimePolicies,
    onShowDeleteMimePoliciesFail,
    enableAllMimeTypesInMimePolicy,
    disableAllMimeTypesInMimePolicy,
    checkingMimePolicyDomainAuthorized,
    onCloseAssignModal,
    modal,
    list,
    status,
    loading,
    pagination,
    filterText,
    filteredList,
    activeMimePolicy,
    filteredListByPage,
    selectedMimePolicies,
  };
}
