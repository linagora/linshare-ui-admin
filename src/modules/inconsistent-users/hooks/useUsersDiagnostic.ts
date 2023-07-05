import { reactive, ref, computed, watch } from 'vue';
import { DEFAULT_PAGE_SIZE } from '@/core/constants';
import { UserDiagnostic } from '../types/UserDiagnotic';
import { message } from 'ant-design-vue';
import { APIError } from '@/core/types/APIError';
import { useI18n } from 'vue-i18n';
import { useLocalStorage } from '@vueuse/core';
import { UsersDiagnosticDetail, UserDiagnosticQuota } from '../types/UserDiagnotic';
import {
  getDiagnoticUserDetails,
  deleteUser,
  saveDiagnosticUserchanges,
  userCheck,
  getDiagnosticUserQuota,
  createDiagnosticUser,
  saveDiagnosticUserQuota,
} from '../services/inconsistent-users-api';
import { InconsistentUsers } from '../types/InconsistentUsers';
import { byteTo, toByte, find } from '@/core/utils/unitStorage';

const activeUserDiagnostic = useLocalStorage<UserDiagnostic>('diagnotic-page-activeUserDiag', {} as UserDiagnostic);
const UserDiagnosticToSave = useLocalStorage<UserDiagnostic>('diagnotic-page-saveUserDiag', {} as UserDiagnostic);
const userDiagnosticQuotaInformations = ref({} as UserDiagnosticQuota);
const selectedUser = ref({} as UsersDiagnosticDetail);
const quotasUnits = reactive({
  personalAllocatedQuotaUnit: '',
  maxFileSizeUnit: '',
  defaultPersonalAllocatedQuotaUnit: '',
  defaultMaxFileSizeUnit: '',
});

const list = ref<UserDiagnostic[]>([]);
const filterText = reactive({
  mail: '',
});

const userCreateModal = reactive({
  open: false,
});

const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: DEFAULT_PAGE_SIZE,
});
const loading = ref(false);

const quotaLoading = ref(false);

const filteredList = computed(() => {
  return list.value.filter((user) => {
    const mailMatch =
      filterText.mail !== '' && filterText.mail !== undefined
        ? user.userMail.toLowerCase().includes(filterText.mail.toLowerCase())
        : true;

    return mailMatch;
  });
});

const filteredListByPage = computed(() => {
  const firstIndex = (pagination.current - 1) * pagination.pageSize;
  const lastIndex = pagination.current * pagination.pageSize;
  return filteredList.value.slice(firstIndex, lastIndex);
});

export default function useUsersDiagnostic() {
  const { t } = useI18n();

  watch(filteredList, async (newVal) => {
    pagination.total = newVal.length;
  });

  async function getUserInformations(userMail: string) {
    loading.value = true;
    try {
      const datas = await userCheck(userMail);
      list.value = datas;
      loading.value = false;
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
  }

  async function getDiagnosticUserInformations() {
    try {
      const datas = await getDiagnoticUserDetails(activeUserDiagnostic.value.uuid);
      selectedUser.value = datas;
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
  }

  async function getDiagnosticUserQuotaInformations() {
    try {
      await getDiagnoticUserDetails(activeUserDiagnostic.value.uuid);
      const quotas = await getDiagnosticUserQuota(selectedUser.value.quotaUuid);
      userDiagnosticQuotaInformations.value = quotas;
      quotasUnits.personalAllocatedQuotaUnit = find(quotas.quota);
      quotasUnits.maxFileSizeUnit = find(quotas.maxFileSize);
      quotasUnits.defaultPersonalAllocatedQuotaUnit = find(quotas.defaultQuota);
      quotasUnits.defaultMaxFileSizeUnit = find(quotas.defaultMaxFileSize);
      userDiagnosticQuotaInformations.value.quota = byteTo(quotas.quota, find(quotas.quota));
      userDiagnosticQuotaInformations.value.maxFileSize = byteTo(quotas.maxFileSize, find(quotas.maxFileSize));
      userDiagnosticQuotaInformations.value.defaultQuota = byteTo(
        quotas.defaultQuota,
        quotasUnits.defaultPersonalAllocatedQuotaUnit
      );
      userDiagnosticQuotaInformations.value.defaultMaxFileSize = byteTo(
        quotas.defaultMaxFileSize,
        quotasUnits.defaultMaxFileSizeUnit
      );
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
  }

  async function diagnoticUserDeletion(user: InconsistentUsers) {
    try {
      await deleteUser(user);
      message.success(t('MESSAGES.DELETE_SUCCESS'));
      list.value = [];
      activeUserDiagnostic.value = undefined;
      handleTableChange(selectedUser.value.mail);
      resetFilters();
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
  }

  async function saveDiagnosticUserModification(user: UsersDiagnosticDetail) {
    try {
      loading.value = true;
      await saveDiagnosticUserchanges(user);
      message.success(t('MESSAGES.UPDATE_SUCCESS'));
      loading.value = false;
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
  }

  function handleTableChange(userMail: string) {
    getUserInformations(userMail);
  }

  async function DiagnosticUserCreation() {
    try {
      await createDiagnosticUser(UserDiagnosticToSave.value.identifier, UserDiagnosticToSave.value.userMail);
      message.success(t('MESSAGES.CREATE_SUCCESS'));
      userCreateModal.open = false;
      handleTableChange(UserDiagnosticToSave.value.userMail);
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
  }

  async function saveQuotaInformations(userQuota: UserDiagnosticQuota) {
    try {
      quotaLoading.value = true;
      userQuota.defaultMaxFileSize = toByte(userQuota.defaultMaxFileSize, quotasUnits.defaultMaxFileSizeUnit);
      userQuota.defaultQuota = toByte(userQuota.defaultQuota, quotasUnits.defaultPersonalAllocatedQuotaUnit);
      userQuota.maxFileSize = toByte(userQuota.maxFileSize, quotasUnits.maxFileSizeUnit);
      userQuota.quota = toByte(userQuota.quota, quotasUnits.personalAllocatedQuotaUnit);
      await saveDiagnosticUserQuota(userQuota);
      await getDiagnosticUserQuotaInformations();
      message.success(t('MESSAGES.UPDATE_SUCCESS'));
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    } finally {
      quotaLoading.value = false;
    }
  }

  function resetFilters() {
    filterText.mail = '';
  }

  function maxQuotaLogic() {
    if (
      toByte(userDiagnosticQuotaInformations.value.maxFileSize, quotasUnits.maxFileSizeUnit) >
      toByte(userDiagnosticQuotaInformations.value.quota, quotasUnits.personalAllocatedQuotaUnit)
    ) {
      return true;
    }
    return false;
  }

  return {
    getUserInformations,
    list,
    loading,
    resetFilters,
    pagination,
    filterText,
    filteredList,
    filteredListByPage,
    handleTableChange,
    activeUserDiagnostic,
    getDiagnosticUserInformations,
    selectedUser,
    diagnoticUserDeletion,
    saveDiagnosticUserModification,
    userCreateModal,
    DiagnosticUserCreation,
    UserDiagnosticToSave,
    userDiagnosticQuotaInformations,
    quotasUnits,
    getDiagnosticUserQuotaInformations,
    maxQuotaLogic,
    saveQuotaInformations,
    quotaLoading,
  };
}
