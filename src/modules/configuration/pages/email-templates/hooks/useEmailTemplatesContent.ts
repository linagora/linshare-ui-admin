import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { STATUS } from '@/core/types/Status';
import { MailContent } from '../types/MailContent';
import { message } from 'ant-design-vue';
import { APIError } from '@/core/types/APIError';
import { DEFAULT_PAGE_SIZE } from '@/core/constants';
import {
  createMailContent,
  getContentEmailTemplates,
  deleteMailContent,
  getMailContentDetail,
  updateMailContent,
} from '../services/email-templates-api';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/modules/auth/store';
import { ACCOUNT_ROLE } from '@/modules/user/types/User';
import { useDomainStore } from '@/modules/domain/store';
import { useRouter } from 'vue-router';
import { CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES } from '../router';
import { useLocalStorage } from '@vueuse/core';
import { EMAIL_DEFAULT_UUID } from '@/core/constants/emails';

const list = ref<MailContent[]>([]);
const loading = ref(false);
const activeMailContent = useLocalStorage<MailContent>(
  'configuration-type-mail-content-activeMailContent',
  {} as MailContent
);
const selectedMailContents = ref<MailContent[]>();
const defaultMailContent = ref<MailContent>();
const status = ref(STATUS.LOADING);
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: DEFAULT_PAGE_SIZE,
});
const filterText = ref('');
const modal = reactive<{
  type:
    | 'CREATE_CONTENT_EMAIL'
    | 'ASSIGN_CONTENT_EMAIL'
    | 'DELETE_CONTENT_EMAIL'
    | 'DELETE_CONTENTS_EMAIL'
    | 'DELETE_CONTENTS_FAIL_EMAIL';
  visible: boolean;
  multipleDeleteResponse?: {
    total: number;
    totalSuccess: number;
    totalFail: number;
    totalAssignCases: number;
    totalUnAuthoCases: number;
  };
}>({
  type: 'CREATE_CONTENT_EMAIL',
  visible: false,
});

export default function useEmailTemplatesContent() {
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

  function onCheckDefaultEmailContent(email: MailContent) {
    return EMAIL_DEFAULT_UUID.CONTENT === email.uuid;
  }
  function onCloseModal() {
    modal.visible = false;
    pagination.current === 1 ? (pagination.current = 1) : pagination.current--;
  }

  function onCreateMailContent(email: MailContent) {
    activeMailContent.value = email;
    modal.type = 'CREATE_CONTENT_EMAIL';
    modal.visible = true;
  }

  function onDeleteMailContent(mailContent: MailContent) {
    activeMailContent.value = mailContent;
    modal.type = 'DELETE_CONTENT_EMAIL';
    modal.visible = true;
  }

  function onDeleteMailContentsFail(response: {
    total: number;
    totalSuccess: number;
    totalFail: number;
    totalAssignCases: number;
    totalUnAuthoCases: number;
  }) {
    modal.type = 'DELETE_CONTENTS_FAIL_EMAIL';
    modal.visible = true;
    modal.multipleDeleteResponse = response;
  }

  function onDeleteMailContents() {
    modal.type = 'DELETE_CONTENTS_EMAIL';
    modal.visible = true;
  }

  async function handleGetEmailContentTemplates(domainUuid: string, onlyCurrentDomain = true) {
    try {
      status.value = STATUS.LOADING;
      const templates = await getContentEmailTemplates(domainUuid, onlyCurrentDomain);
      list.value = templates
        ?.map((item) => {
          return { ...item, assigned: isAssigned(item.uuid, currentDomain.value.mailContent?.uuid) };
        })
        .sort((a: MailContent, b: MailContent) => (b.modificationDate || 0) - (a.modificationDate || 0));
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

  function isAssigned(mailContentUuid: string, currentDomainMailContentUuid: string | undefined) {
    if (mailContentUuid === currentDomainMailContentUuid) {
      return true;
    }
    return false;
  }

  async function handleDeleteMailContent(activeMailContent: MailContent) {
    try {
      if (!activeMailContent || !activeMailContent?.uuid) {
        return false;
      }
      if (onCheckDefaultEmailContent(activeMailContent)) {
        message.error(t('EMAIL_TEMPLATES.DELETE_CONTENT_MODAL.DELETE_ERROR_UNAUTHORIZED'));
        loading.value = false;
        return false;
      }
      loading.value = true;
      if (activeMailContent?.assigned) {
        message.error(t('EMAIL_TEMPLATES.DELETE_CONTENT_MODAL.DELETE_ERROR_ASSIGNED'));
        loading.value = false;
        return false;
      }
      await deleteMailContent({ uuid: activeMailContent?.uuid });
      return true;
    } catch (error) {
      if (error instanceof APIError) {
        if (error.errorCode === 16666) {
          message.error(t('EMAIL_TEMPLATES.DELETE_CONTENT_MODAL.DELETE_ERROR_ASSIGNED'));
        } else if (error.errorCode === 166678) {
          message.error(t('EMAIL_TEMPLATES.DELETE_CONTENT_MODAL.DELETE_ERROR_UNAUTHORIZED'));
        } else {
          message.error(error.getMessage());
        }
      }
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function handleDeleteMailContents() {
    try {
      if (!selectedMailContents?.value?.length) {
        message.error(t('EMAIL_TEMPLATES.DELETE_CONTENT_MODAL.DELETE_MODAL_EMPTY'));
        return {
          total: selectedMailContents?.value?.length,
          totalSuccess: 0,
          totalFail: selectedMailContents?.value?.length,
          totalAssignCases: 0,
          totalUnAuthoCases: 0,
        };
      }

      loading.value = true;
      const deletePromises = selectedMailContents.value?.map((item) => {
        return deleteMailContent({ uuid: item?.uuid });
      });
      if (!deletePromises) {
        return {
          total: selectedMailContents?.value?.length,
          totalSuccess: 0,
          totalFail: selectedMailContents?.value?.length,
          totalAssignCases: 0,
          totalUnAuthoCases: 0,
        };
      }

      return await Promise.allSettled(deletePromises).then((results) => {
        return {
          total: selectedMailContents?.value?.length,
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
        total: selectedMailContents?.value?.length,
        totalSuccess: 0,
        totalFail: selectedMailContents?.value?.length,
        totalAssignCases: 0,
        totalUnAuthoCases: 0,
      };
    } finally {
      loading.value = false;
    }
  }

  function handleResetEmailContent() {
    activeMailContent.value = { ...defaultMailContent.value };
  }

  async function handleUpdateMailContent(payload: MailContent) {
    try {
      loading.value = true;
      await updateMailContent(payload);
      message.success(t('EMAIL_TEMPLATES.EDIT_FORM.UPDATE_SUCCESS'));
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    } finally {
      loading.value = false;
    }
  }

  function checkingEmailContentsDomainAuthorized(domainUuid: string) {
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

  async function handleCreateMailContent(payload: {
    description: string;
    domain: string;
    domainName?: string;
    content: string;
    messagesEnglish: string;
    messagesFrench: string;
    messagesRussian: string;
    visible: boolean;
    readonly: boolean;
  }) {
    try {
      loading.value = true;
      delete payload.domainName;
      await createMailContent(payload);
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

  function onEditMailContent(record: MailContent) {
    activeMailContent.value = record;
    router.push({ name: CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES.CONTENT_DETAIL, params: { id: record?.uuid } });
  }

  async function handleGetMailContentDetail(uuid: string) {
    status.value = STATUS.LOADING;
    try {
      const messages = await getMailContentDetail(uuid, currentDomain.value.uuid);
      status.value = STATUS.SUCCESS;
      activeMailContent.value = messages;
      defaultMailContent.value = { ...messages };
    } catch (error) {
      status.value = STATUS.ERROR;
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
  }
  function resetSelectEmailContents() {
    selectedMailContents.value = [];
  }

  return {
    list,
    modal,
    status,
    loading,
    filterText,
    pagination,
    languageOptions,
    activeMailContent,
    selectedMailContents,
    onCloseModal,
    onEditMailContent,
    onDeleteMailContent,
    onCreateMailContent,
    onDeleteMailContents,
    handleResetEmailContent,
    handleDeleteMailContent,
    handleCreateMailContent,
    handleUpdateMailContent,
    handleDeleteMailContents,
    onDeleteMailContentsFail,
    resetSelectEmailContents,
    handleGetMailContentDetail,
    onCheckDefaultEmailContent,
    handleGetEmailContentTemplates,
    checkingEmailContentsDomainAuthorized,
  };
}
