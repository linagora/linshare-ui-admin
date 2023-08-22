import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { STATUS } from '@/core/types/Status';
import { MailActivation } from '../types/MailActivation';
import { message } from 'ant-design-vue';
import { APIError } from '@/core/types/APIError';
import { DEFAULT_PAGE_SIZE } from '@/core/constants';
import {
  createMailActivation,
  getActivationEmailTemplates,
  deleteMailActivation,
  getMailActivationDetail,
  updateMailActivation,
} from '../services/email-templates-api';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/modules/auth/store';
import { ACCOUNT_ROLE } from '@/modules/user/types/User';
import { useDomainStore } from '@/modules/domain/store';
import { useRouter } from 'vue-router';
import { CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES } from '../router';
import { useLocalStorage } from '@vueuse/core';
import { EMAIL_DEFAULT_UUID } from '@/core/constants/emails';

const list = ref<MailActivation[]>([]);
const loading = ref(false);
const activeMailActivation = useLocalStorage<MailActivation>(
  'configuration-type-mail-activation-activeMailActivation',
  {} as MailActivation
);
const selectedMailActivations = ref<MailActivation[]>();
const defaultMailActivation = ref<MailActivation>();
const status = ref(STATUS.LOADING);
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: DEFAULT_PAGE_SIZE,
});
const filterText = ref('');
const modal = reactive<{
  type:
    | 'CREATE_FOOTER_EMAIL'
    | 'ASSIGN_FOOTER_EMAIL'
    | 'DELETE_FOOTER_EMAIL'
    | 'DELETE_FOOTERS_EMAIL'
    | 'DELETE_FOOTERS_FAIL_EMAIL';
  visible: boolean;
  multipleDeleteResponse?: {
    total: number;
    totalSuccess: number;
    totalFail: number;
    totalAssignCases: number;
    totalUnAuthoCases: number;
  };
}>({
  type: 'CREATE_FOOTER_EMAIL',
  visible: false,
});

export default function useEmailTemplatesActivation() {
  //composable
  const { t } = useI18n();
  const { loggedUserRole } = storeToRefs(useAuthStore());
  const { getDomainsList, currentDomain } = storeToRefs(useDomainStore());
  const router = useRouter();

  // computed
  const languageOptions = computed(() => {
    return [
      { label: t(`LOCALE.ENGLISH`), value: 'messagesEnglish' },
      { label: t(`LOCALE.FRENCH`), value: 'messagesFrench' },
      { label: t(`LOCALE.RUSSIAN`), value: 'messagesRussian' },
      { label: t(`LOCALE.VIETNAMESE`), value: 'messagesVietnamese' },
    ];
  });

  //methods

  function onCheckDefaultEmailActivation(email: MailActivation) {
    return EMAIL_DEFAULT_UUID.FOOTER === email.uuid;
  }
  function onCloseModal() {
    modal.visible = false;
    pagination.current === 1 ? (pagination.current = 1) : pagination.current--;
  }

  function onCreateMailActivation(email: MailActivation) {
    activeMailActivation.value = email;
    modal.type = 'CREATE_FOOTER_EMAIL';
    modal.visible = true;
  }

  function onDeleteMailActivation(mailActivation: MailActivation) {
    activeMailActivation.value = mailActivation;
    modal.type = 'DELETE_FOOTER_EMAIL';
    modal.visible = true;
  }

  function onDeleteMailActivationsFail(response: {
    total: number;
    totalSuccess: number;
    totalFail: number;
    totalAssignCases: number;
    totalUnAuthoCases: number;
  }) {
    modal.type = 'DELETE_FOOTERS_FAIL_EMAIL';
    modal.visible = true;
    modal.multipleDeleteResponse = response;
  }

  function onDeleteMailActivations() {
    modal.type = 'DELETE_FOOTERS_EMAIL';
    modal.visible = true;
  }

  async function handleGetEmailActivationTemplates(domainUuid: string, onlyCurrentDomain = true) {
    try {
      status.value = STATUS.LOADING;
      const templates = await getActivationEmailTemplates(domainUuid, onlyCurrentDomain);
      list.value = templates
        ?.map((item) => {
          return { ...item, assigned: isAssigned(item.uuid, currentDomain.value.mailActivation?.uuid) };
        })
        .sort((a: MailActivation, b: MailActivation) => (b.modificationDate || 0) - (a.modificationDate || 0));
      status.value = STATUS.SUCCESS;
      return;
    } catch (error) {
      status.value = STATUS.ERROR;
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    } finally {
      status.value = STATUS.SUCCESS;
    }
  }

  function isAssigned(mailActivationUuid: string, currentDomainMailActivationUuid: string | undefined) {
    if (mailActivationUuid === currentDomainMailActivationUuid) {
      return true;
    }
    return false;
  }

  async function handleDeleteMailActivation(activeMailActivation: MailActivation) {
    try {
      if (!activeMailActivation || !activeMailActivation?.uuid) {
        return false;
      }
      if (onCheckDefaultEmailActivation(activeMailActivation)) {
        message.error(t('EMAIL_TEMPLATES.DELETE_FOOTER_MODAL.DELETE_ERROR_UNAUTHORIZED'));
        loading.value = false;
        return false;
      }
      loading.value = true;
      if (activeMailActivation?.assigned) {
        message.error(t('EMAIL_TEMPLATES.DELETE_FOOTER_MODAL.DELETE_ERROR_ASSIGNED'));
        loading.value = false;
        return false;
      }
      await deleteMailActivation({ uuid: activeMailActivation?.uuid });
      return true;
    } catch (error) {
      if (error instanceof APIError) {
        if (error.errorCode === 16666) {
          message.error(t('EMAIL_TEMPLATES.DELETE_FOOTER_MODAL.DELETE_ERROR_ASSIGNED'));
        } else if (error.errorCode === 166678) {
          message.error(t('EMAIL_TEMPLATES.DELETE_FOOTER_MODAL.DELETE_ERROR_UNAUTHORIZED'));
        } else {
          message.error(error.getMessage());
        }
      }
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function handleDeleteMailActivations() {
    try {
      if (!selectedMailActivations?.value?.length) {
        message.error(t('EMAIL_TEMPLATES.DELETE_FOOTER_MODAL.DELETE_MODAL_EMPTY'));
        return {
          total: selectedMailActivations?.value?.length,
          totalSuccess: 0,
          totalFail: selectedMailActivations?.value?.length,
          totalAssignCases: 0,
          totalUnAuthoCases: 0,
        };
      }

      loading.value = true;
      const deletePromises = selectedMailActivations.value?.map((item) => {
        return deleteMailActivation({ uuid: item?.uuid });
      });
      if (!deletePromises) {
        return {
          total: selectedMailActivations?.value?.length,
          totalSuccess: 0,
          totalFail: selectedMailActivations?.value?.length,
          totalAssignCases: 0,
          totalUnAuthoCases: 0,
        };
      }

      return await Promise.allSettled(deletePromises).then((results) => {
        return {
          total: selectedMailActivations?.value?.length,
          totalSuccess: results.filter((item) => item.status === 'fulfilled')?.length ?? 0,
          totalFail: results.filter((item) => item.status === 'rejected')?.length ?? 0,
          totalAssignCases:
            results.filter((item) => item.status === 'rejected' && item.reason?.errorCode === 16666)?.length ?? 0,
          totalUnAuthoCases:
            results.filter(
              (item) =>
                item.status === 'rejected' && (item.reason?.errorCode === 166678 || item.reason?.errorCode === 18670)
            )?.length ?? 0,
        };
      });
    } catch (error) {
      return {
        total: selectedMailActivations?.value?.length,
        totalSuccess: 0,
        totalFail: selectedMailActivations?.value?.length,
        totalAssignCases: 0,
        totalUnAuthoCases: 0,
      };
    } finally {
      loading.value = false;
    }
  }

  function handleResetEmailActivation() {
    activeMailActivation.value = { ...defaultMailActivation.value };
  }

  async function handleUpdateMailActivation(payload: MailActivation) {
    try {
      loading.value = true;
      await updateMailActivation(payload);
      message.success(t('EMAIL_TEMPLATES.EDIT_FORM.UPDATE_SUCCESS'));
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    } finally {
      loading.value = false;
    }
  }

  function checkingEmailActivationsDomainAuthorized(domainUuid: string) {
    if (!domainUuid) {
      return false;
    }
    if (loggedUserRole.value === ACCOUNT_ROLE.SUPERADMIN) {
      return true;
    } else {
      return (
        getDomainsList.value.some((item) => {
          return item.uuid === domainUuid;
        }) && loggedUserRole?.value === ACCOUNT_ROLE.ADMIN
      );
    }
  }

  async function handleCreateMailActivation(payload: {
    description: string;
    domain: string;
    domainName?: string;
    activation: string;
    messagesEnglish: string;
    messagesFrench: string;
    messagesRussian: string;
    visible: boolean;
    readonly: boolean;
  }) {
    try {
      loading.value = true;
      delete payload.domainName;
      await createMailActivation(payload);
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

  function onEditMailActivation(record: MailActivation) {
    activeMailActivation.value = record;
    router.push({ name: CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES.FOOTER_DETAIL, params: { id: record?.uuid } });
  }

  async function handleGetMailActivationDetail(uuid: string) {
    status.value = STATUS.LOADING;
    try {
      const messages = await getMailActivationDetail(uuid, currentDomain.value.uuid);
      status.value = STATUS.SUCCESS;
      activeMailActivation.value = messages;
      defaultMailActivation.value = { ...messages };
    } catch (error) {
      status.value = STATUS.ERROR;
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
  }
  function resetSelectEmailActivations() {
    selectedMailActivations.value = [];
  }

  return {
    list,
    modal,
    status,
    loading,
    filterText,
    pagination,
    languageOptions,
    activeMailActivation,
    selectedMailActivations,
    onCloseModal,
    onEditMailActivation,
    onDeleteMailActivation,
    onCreateMailActivation,
    onDeleteMailActivations,
    handleResetEmailActivation,
    handleDeleteMailActivation,
    handleCreateMailActivation,
    handleUpdateMailActivation,
    handleDeleteMailActivations,
    onDeleteMailActivationsFail,
    resetSelectEmailActivations,
    handleGetMailActivationDetail,
    onCheckDefaultEmailActivation,
    handleGetEmailActivationTemplates,
    checkingEmailActivationsDomainAuthorized,
  };
}
