import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { STATUS } from '@/core/types/Status';
import { MailLayout } from '../types/MailLayout';
import { message } from 'ant-design-vue';
import { APIError } from '@/core/types/APIError';
import { DEFAULT_PAGE_SIZE } from '@/core/constants';
import {
  createMailLayout,
  getLayoutEmailTemplates,
  deleteMailLayout,
  getMailLayoutDetail,
  updateMailLayout,
} from '../services/email-templates-api';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/modules/auth/store';
import { ACCOUNT_ROLE } from '@/modules/user/types/User';
import { useDomainStore } from '@/modules/domain/store';
import { useRouter } from 'vue-router';
import { CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES } from '../router';
import { useLocalStorage } from '@vueuse/core';
import { EMAIL_DEFAULT_UUID } from '@/core/constants/emails';

const list = ref<MailLayout[]>([]);
const loading = ref(false);
const activeMailLayout = useLocalStorage<MailLayout>(
  'configuration-type-mail-layout-activeMailLayout',
  {} as MailLayout
);
const selectedMailLayouts = ref<MailLayout[]>();
const defaultMailLayout = ref<MailLayout>();
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

  function onCheckDefaultEmailLayout(email: MailLayout) {
    return EMAIL_DEFAULT_UUID.LAYOUT === email.uuid;
  }
  function onCloseModal() {
    modal.visible = false;
    pagination.current === 1 ? (pagination.current = 1) : pagination.current--;
  }

  function onCreateMailLayout(email: MailLayout) {
    activeMailLayout.value = email;
    modal.type = 'CREATE_LAYOUT_EMAIL';
    modal.visible = true;
  }

  function onDeleteMailLayout(mailLayout: MailLayout) {
    activeMailLayout.value = mailLayout;
    modal.type = 'DELETE_LAYOUT_EMAIL';
    modal.visible = true;
  }

  function onDeleteMailLayoutsFail(response: {
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

  function onDeleteMailLayouts() {
    modal.type = 'DELETE_LAYOUTS_EMAIL';
    modal.visible = true;
  }

  async function handleGetEmailLayoutTemplates(domainUuid: string, onlyCurrentDomain = true) {
    try {
      status.value = STATUS.LOADING;
      const templates = await getLayoutEmailTemplates(currentDomain.value.uuid, onlyCurrentDomain);
      list.value = templates
        ?.map((item) => {
          return { ...item, assigned: isAssigned(item.uuid, currentDomain.value.mailLayout?.uuid) };
        })
        .sort((a: MailLayout, b: MailLayout) => (b.modificationDate || 0) - (a.modificationDate || 0));
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
        } else if (activeMailLayout?.uuid === EMAIL_DEFAULT_UUID.LAYOUT) {
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

  async function handleDeleteMailLayouts() {
    try {
      if (!selectedMailLayouts?.value?.length) {
        message.error(t('EMAIL_TEMPLATES.DELETE_LAYOUT_MODAL.DELETE_MODAL_EMPTY'));
        return {
          total: selectedMailLayouts?.value?.length,
          totalSuccess: 0,
          totalFail: selectedMailLayouts?.value?.length,
          totalAssignCases: 0,
          totalUnAuthoCases: 0,
        };
      }

      loading.value = true;
      const deletePromises = selectedMailLayouts.value?.map((item) => {
        return deleteMailLayout({ uuid: item?.uuid });
      });
      if (!deletePromises) {
        return {
          total: selectedMailLayouts?.value?.length,
          totalSuccess: 0,
          totalFail: selectedMailLayouts?.value?.length,
          totalAssignCases: 0,
          totalUnAuthoCases: 0,
        };
      }

      return await Promise.allSettled(deletePromises).then((results) => {
        return {
          total: selectedMailLayouts?.value?.length,
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
        total: selectedMailLayouts?.value?.length,
        totalSuccess: 0,
        totalFail: selectedMailLayouts?.value?.length,
        totalAssignCases: 0,
        totalUnAuthoCases: 0,
      };
    } finally {
      loading.value = false;
    }
  }

  function handleResetEmailLayout() {
    activeMailLayout.value = { ...defaultMailLayout.value };
  }

  async function handleUpdateMailLayout(payload: MailLayout) {
    try {
      await updateMailLayout(payload);
      message.success(t('EMAIL_TEMPLATES.EDIT_FORM.UPDATE_SUCCESS'));
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
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

  function onEditMailLayout(record: MailLayout) {
    activeMailLayout.value = record;
    router.push({ name: CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES.LAYOUT_DETAIL, params: { id: record?.uuid } });
  }

  async function handleGetMailLayoutDetail(uuid: string) {
    status.value = STATUS.LOADING;
    try {
      const messages = await getMailLayoutDetail(uuid, currentDomain.value.uuid);
      status.value = STATUS.SUCCESS;
      activeMailLayout.value = messages;
      defaultMailLayout.value = { ...messages };
    } catch (error) {
      status.value = STATUS.ERROR;
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
  }
  function resetSelectEmailLayouts() {
    selectedMailLayouts.value = [];
  }

  function resetMailLayoutPaging() {
    pagination.current = 1;
    pagination.total = 0;
    pagination.pageSize = DEFAULT_PAGE_SIZE;
  }

  return {
    list,
    modal,
    status,
    loading,
    filterText,
    pagination,
    languageOptions,
    activeMailLayout,
    selectedMailLayouts,
    onCloseModal,
    onEditMailLayout,
    onDeleteMailLayout,
    onCreateMailLayout,
    onDeleteMailLayouts,
    handleResetEmailLayout,
    handleDeleteMailLayout,
    handleCreateMailLayout,
    handleUpdateMailLayout,
    handleDeleteMailLayouts,
    onDeleteMailLayoutsFail,
    resetSelectEmailLayouts,
    handleGetMailLayoutDetail,
    handleGetEmailLayoutTemplates,
    onCheckDefaultEmailLayout,
    checkingEmailLayoutsDomainAuthorized,
    resetMailLayoutPaging,
  };
}
