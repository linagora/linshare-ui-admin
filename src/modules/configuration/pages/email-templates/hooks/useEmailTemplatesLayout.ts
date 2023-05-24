import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { STATUS } from '@/core/types/Status';
import { MailLayout } from '../types/MailLayout';
import message from 'ant-design-vue/lib/message';
import { APIError } from '@/core/types/APIError';
import { DEFAULT_PAGE_SIZE } from '@/core/constants';
import { createMailLayout, getLayoutEmailTemplates, deleteMailLayout } from '../services/email-templates-api';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/modules/auth/store';
import { ACCOUNT_ROLE } from '@/modules/user/types/User';
import { useDomainStore } from '@/modules/domain/store';
import { useLocalStorage } from '@vueuse/core';

const list = ref<MailLayout[]>([]);
const loading = ref(false);
const activeMailLayout = useLocalStorage<MailLayout>(
  'configuration-type-mail-layout-activeMailLayout',
  {} as MailLayout
);
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
export default function useEmailTemplatesLayout() {
  //composable
  const { t } = useI18n();
  const { loggedUserRole } = storeToRefs(useAuthStore());
  const { getDomainsList, currentDomain } = storeToRefs(useDomainStore());

  //methods

  function onCloseModal() {
    modal.visible = false;
  }

  function onDeleteMailLayout(mailLayout: MailLayout) {
    activeMailLayout.value = mailLayout;
    modal.type = 'DELETE_LAYOUT_EMAIL';
    modal.visible = true;
  }

  async function handleGetEmailLayoutTemplates(domainUuid: string) {
    try {
      status.value = STATUS.LOADING;
      const templates = await getLayoutEmailTemplates(domainUuid, true);
      list.value = templates?.map((item) => {
        return { ...item, assigned: isAssigned(item.uuid, currentDomain.value.mailConfiguration?.uuid) };
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
  function isAssigned(mailLayoutUuid: string, currentDomainMailLayoutUuid: string | undefined) {
    if (mailLayoutUuid === currentDomainMailLayoutUuid) {
      return true;
    }
    return false;
  }
  async function handleDeleteMailLayout(activeMailLayout: MailLayout) {
    try {
      if (!activeMailLayout || !activeMailLayout?.uuid) {
        return false;
      }
      loading.value = true;
      if (activeMailLayout?.assigned) {
        message.error(t('EMAIL_TEMPLATES.DELETE_LAYOUT_MODAL.DELETE_ERROR_ASSIGNED'));
        loading.value = false;
        return false;
      }
      await deleteMailLayout({ uuid: activeMailLayout?.uuid });
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

  function checkingEmailLayoutsDomainAuthorized(domainUuid: string) {
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

  async function handleCreateMailLayout(payload: {
    description: string;
    domain: string;
    domainName: string;
    layout: string;
    messagesEnglish: string;
    messagesFrench: string;
    messagesRussian: string;
    visible: boolean;
    readonly: boolean;
  }) {
    try {
      loading.value = true;
      await createMailLayout(payload);
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

  return {
    list,
    modal,
    status,
    loading,
    filterText,
    pagination,
    activeMailLayout,
    onCloseModal,
    onDeleteMailLayout,
    handleDeleteMailLayout,
    handleGetEmailLayoutTemplates,
    checkingEmailLayoutsDomainAuthorized,
    handleCreateMailLayout,
  };
}
