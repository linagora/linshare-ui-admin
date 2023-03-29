import { reactive, ref, computed, watch } from 'vue';
import { DEFAULT_PAGE_SIZE } from '@/core/constants';
import { message } from 'ant-design-vue';
import { APIError } from '@/core/types/APIError';
import { deleteMimePolicy, getMimePolicies } from '../services/mime-policies-api';
import MimePolicy from '../types/MimeType';
import { STATUS } from '@/core/types/Status';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/modules/auth/store';
import { ACCOUNT_ROLE } from '@/modules/user/types/User';
import { useDomainStore } from '@/modules/domain/store';

const activeMimePolicy = ref<MimePolicy>();
const selectedMimePolicies = ref<MimePolicy[]>();
const modal = reactive<{
  type: 'DELETE_MIME_MODAL' | 'DELETE_MIME_POLICIES_MODAL' | 'DELETE_MIME_POLICIES_FAIL_MODAL';
  visible: boolean;
}>({
  type: 'DELETE_MIME_MODAL',
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
  const { getDomainsList } = storeToRefs(useDomainStore());
  // data
  const loading = ref(false);

  //hooks
  watch(filteredList, async (newVal) => {
    pagination.total = newVal.length;
  });

  function onCloseModal() {
    modal.visible = false;
  }

  function onDeleteMimePolicy(mime: MimePolicy) {
    activeMimePolicy.value = mime;
    modal.type = 'DELETE_MIME_MODAL';
    modal.visible = true;
  }

  function onDeleteMimePolicies() {
    const unAuthorizeDomain = selectedMimePolicies.value?.some((item) => !checkingMimePolicyDomainAuthorized(item));

    if (unAuthorizeDomain) {
      message.error(t('MIME_POLICIES.DELETE_MODAL.UNABLE_DELETE_MIME'));
      return;
    }

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
      list.value = mimes;
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

  function checkingMimePolicyDomainAuthorized(record: MimePolicy) {
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

  return {
    isAssigned,
    isEditable,
    onCloseModal,
    onDeleteMimePolicy,
    getMimePoliciesList,
    onDeleteMimePolicies,
    handleDeleteMimePolicy,
    handleDeleteMimePolicies,
    onShowDeleteMimePoliciesFail,
    modal,
    list,
    status,
    loading,
    pagination,
    filterText,
    filteredList,
    filteredListByPage,
    selectedMimePolicies,
  };
}
