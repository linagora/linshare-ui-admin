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
  type: 'CREATE_FOOTER_EMAIL' | 'ASSIGN_FOOTER_EMAIL';
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

  async function handleGetEmailActivationTemplates(domainUuid: string, onlyCurrentDomain = true) {
    try {
      status.value = STATUS.LOADING;
      const templates = await getActivationEmailTemplates(domainUuid, onlyCurrentDomain);
      list.value = templates;
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

  async function handleResetMailActivation(payload: MailActivation) {
    try {
      loading.value = true;
      await deleteMailActivation(payload);
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
    onCreateMailActivation,
    handleResetMailActivation,
    handleCreateMailActivation,
    handleUpdateMailActivation,
    resetSelectEmailActivations,
    handleGetMailActivationDetail,
    onCheckDefaultEmailActivation,
    handleGetEmailActivationTemplates,
    checkingEmailActivationsDomainAuthorized,
  };
}
