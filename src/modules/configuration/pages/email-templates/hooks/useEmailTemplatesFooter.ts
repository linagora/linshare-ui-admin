import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { STATUS } from '@/core/types/Status';
import { MailFooter } from '../types/MailFooter';
import message from 'ant-design-vue/lib/message';
import { APIError } from '@/core/types/APIError';
import { DEFAULT_PAGE_SIZE } from '@/core/constants';
import {
  createMailFooter,
  getFooterEmailTemplates,
  deleteMailFooter,
  getMailFooterDetail,
  updateMailFooter,
} from '../services/email-templates-api';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/modules/auth/store';
import { ACCOUNT_ROLE } from '@/modules/user/types/User';
import { useDomainStore } from '@/modules/domain/store';
import { useRouter } from 'vue-router';
import { CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES } from '../router';
import { useLocalStorage } from '@vueuse/core';

const list = ref<MailFooter[]>([]);
const loading = ref(false);
const activeMailFooter = useLocalStorage<MailFooter>(
  'configuration-type-mail-footer-activeMailFooter',
  {} as MailFooter
);
const selectedMailFooters = ref<MailFooter[]>();
const defaultMailFooter = ref<MailFooter>();
const status = ref(STATUS.LOADING);
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: DEFAULT_PAGE_SIZE,
});
const filterText = ref('');
const modal = reactive<{
  type:
    | 'CREATE_LAYOUT_EMAIL'
    | 'ASSIGN_LAYOUT_EMAIL'
    | 'DELETE_LAYOUT_EMAIL'
    | 'DELETE_LAYOUTS_EMAIL'
    | 'DELETE_LAYOUTS_FAIL_EMAIL';
  visible: boolean;
  multipleDeleteResponse?: {
    total: number;
    totalSuccess: number;
    totalFail: number;
    totalAssignCases: number;
    totalUnAuthoCases: number;
  };
}>({
  type: 'CREATE_LAYOUT_EMAIL',
  visible: false,
});

export default function useEmailTemplatesFooter() {
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
    ];
  });

  //methods

  function onCloseModal() {
    modal.visible = false;
    pagination.current === 1 ? (pagination.current = 1) : pagination.current--;
  }

  function onCreateMailFooter(email: MailFooter) {
    activeMailFooter.value = email;
    modal.type = 'CREATE_LAYOUT_EMAIL';
    modal.visible = true;
  }

  function onDeleteMailFooter(mailFooter: MailFooter) {
    activeMailFooter.value = mailFooter;
    modal.type = 'DELETE_LAYOUT_EMAIL';
    modal.visible = true;
  }

  function onDeleteMailFootersFail(response: {
    total: number;
    totalSuccess: number;
    totalFail: number;
    totalAssignCases: number;
    totalUnAuthoCases: number;
  }) {
    modal.type = 'DELETE_LAYOUTS_FAIL_EMAIL';
    modal.visible = true;
    modal.multipleDeleteResponse = response;
  }

  function onDeleteMailFooters() {
    modal.type = 'DELETE_LAYOUTS_EMAIL';
    modal.visible = true;
  }

  async function handleGetEmailFooterTemplates(domainUuid: string, onlyCurrentDomain = true) {
    try {
      status.value = STATUS.LOADING;
      const templates = await getFooterEmailTemplates(domainUuid, onlyCurrentDomain);
      list.value = templates?.map((item) => {
        return { ...item, assigned: isAssigned(item.uuid, currentDomain.value.mailFooter?.uuid) };
      });
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

  function isAssigned(mailFooterUuid: string, currentDomainMailFooterUuid: string | undefined) {
    if (mailFooterUuid === currentDomainMailFooterUuid) {
      return true;
    }
    return false;
  }

  async function handleDeleteMailFooter(activeMailFooter: MailFooter) {
    try {
      if (!activeMailFooter || !activeMailFooter?.uuid) {
        return false;
      }
      loading.value = true;
      if (activeMailFooter?.assigned) {
        message.error(t('EMAIL_TEMPLATES.DELETE_LAYOUT_MODAL.DELETE_ERROR_ASSIGNED'));
        loading.value = false;
        return false;
      }
      await deleteMailFooter({ uuid: activeMailFooter?.uuid });
      return true;
    } catch (error) {
      if (error instanceof APIError) {
        if (error.errorCode === 16666) {
          message.error(t('EMAIL_TEMPLATES.DELETE_LAYOUT_MODAL.DELETE_ERROR_ASSIGNED'));
        } else if (error.errorCode === 166678) {
          message.error(t('EMAIL_TEMPLATES.DELETE_LAYOUT_MODAL.DELETE_ERROR_UNAUTHORIZED'));
        } else {
          message.error(error.getMessage());
        }
      }
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function handleDeleteMailFooters() {
    try {
      if (!selectedMailFooters?.value?.length) {
        message.error(t('EMAIL_TEMPLATES.DELETE_LAYOUT_MODAL.DELETE_MODAL_EMPTY'));
        return {
          total: selectedMailFooters?.value?.length,
          totalSuccess: 0,
          totalFail: selectedMailFooters?.value?.length,
          totalAssignCases: 0,
          totalUnAuthoCases: 0,
        };
      }

      loading.value = true;
      const deletePromises = selectedMailFooters.value?.map((item) => {
        return deleteMailFooter({ uuid: item?.uuid });
      });
      if (!deletePromises) {
        return {
          total: selectedMailFooters?.value?.length,
          totalSuccess: 0,
          totalFail: selectedMailFooters?.value?.length,
          totalAssignCases: 0,
          totalUnAuthoCases: 0,
        };
      }

      return await Promise.allSettled(deletePromises).then((results) => {
        return {
          total: selectedMailFooters?.value?.length,
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
        total: selectedMailFooters?.value?.length,
        totalSuccess: 0,
        totalFail: selectedMailFooters?.value?.length,
        totalAssignCases: 0,
        totalUnAuthoCases: 0,
      };
    } finally {
      loading.value = false;
    }
  }

  function handleResetEmailFooter() {
    activeMailFooter.value = { ...defaultMailFooter.value };
  }

  async function handleUpdateMailFooter(payload: MailFooter) {
    try {
      await updateMailFooter(payload);
      message.success(t('EMAIL_TEMPLATES.EDIT_FORM.UPDATE_SUCCESS'));
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
  }

  function checkingEmailFootersDomainAuthorized(domainUuid: string) {
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

  async function handleCreateMailFooter(payload: {
    description: string;
    domain: string;
    domainName: string;
    footer: string;
    messagesEnglish: string;
    messagesFrench: string;
    messagesRussian: string;
    visible: boolean;
    readonly: boolean;
  }) {
    try {
      loading.value = true;
      await createMailFooter(payload);
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

  function onEditMailFooter(record: MailFooter) {
    activeMailFooter.value = record;
    router.push({ name: CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES.LAYOUT_DETAIL, params: { id: record?.uuid } });
  }

  async function handleGetMailFooterDetail(uuid: string) {
    status.value = STATUS.LOADING;
    try {
      const messages = await getMailFooterDetail(uuid, currentDomain.value.uuid);
      status.value = STATUS.SUCCESS;
      activeMailFooter.value = messages;
      defaultMailFooter.value = { ...messages };
    } catch (error) {
      status.value = STATUS.ERROR;
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
  }
  function resetSelectEmailFooters() {
    selectedMailFooters.value = [];
  }

  return {
    list,
    modal,
    status,
    loading,
    filterText,
    pagination,
    languageOptions,
    activeMailFooter,
    selectedMailFooters,
    onCloseModal,
    onEditMailFooter,
    onDeleteMailFooter,
    onCreateMailFooter,
    onDeleteMailFooters,
    handleResetEmailFooter,
    handleDeleteMailFooter,
    handleCreateMailFooter,
    handleUpdateMailFooter,
    handleDeleteMailFooters,
    onDeleteMailFootersFail,
    resetSelectEmailFooters,
    handleGetMailFooterDetail,
    handleGetEmailFooterTemplates,
    checkingEmailFootersDomainAuthorized,
  };
}
