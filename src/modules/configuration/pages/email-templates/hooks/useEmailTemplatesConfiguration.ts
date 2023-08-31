import { reactive, ref, computed, watch } from 'vue';
import { DEFAULT_PAGE_SIZE } from '@/core/constants';
import { MailConfiguration, MailLang, MailFooterLangs } from '../types/MailConfiguration';
import { message } from 'ant-design-vue';
import { APIError } from '@/core/types/APIError';
import { STATUS } from '@/core/types/Status';
import { useI18n } from 'vue-i18n';
import {
  getMailContentList,
  updateMailConfiguration,
  getMailConfigurationList,
  assignMailConfiguration,
  createMailConfiguration,
  deleteMailConfiguration,
  getMailConfigurationDetail,
  updateMailConfigurationMailContent,
  getMailConfigurationLanguagesSupport,
  getMailConfigurationFooterList,
  assignMailFooterToMailConfiguration,
} from '../services/email-templates-api';
import { storeToRefs } from 'pinia';
import { useDomainStore } from '@/modules/domain/store';
import Domain from '@/core/types/Domain';
import { useLocalStorage } from '@vueuse/core';
import { useRouter } from 'vue-router';
import { CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES } from '../router';
import { EMAIL_DEFAULT_UUID } from '@/core/constants/emails';
import { MailFooter } from '../types/MailFooter';

const activeMailConfig = useLocalStorage<MailConfiguration>(
  'configuration-type-mail-config-activeMailConfig',
  {} as MailConfiguration
);
const activeEmailConfigForm = ref<Partial<MailConfiguration>>({});
const defaultMailConfigurationForm = ref<Partial<MailConfiguration>>({});
const mailFooterLangsForm = ref<MailFooterLangs>({});
const defaultMailFooterLangsForm = ref<MailFooterLangs>({});
const selectedMailConfigs = ref<MailConfiguration[]>();

const list = ref<MailConfiguration[]>([]);
const footerList = ref<MailFooter[]>([]);
const filterText = ref('');
const status = ref(STATUS.LOADING);
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: DEFAULT_PAGE_SIZE,
});
const loading = ref(false);

const MailConfigurationUuid = reactive<{
  uuid: string;
}>({
  uuid: '',
});

const modal = reactive<{
  type:
    | 'CREATE_CONFIGURATION_EMAIL'
    | 'ASSIGN_CONFIGURATION_EMAIL'
    | 'DELETE_CONFIGURATION_EMAIL'
    | 'DELETE_CONFIGURATIONS_EMAIL'
    | 'DELETE_CONFIGURATIONS_FAIL_EMAIL';
  visible: boolean;
  multipleDeleteResponse?: {
    total: number;
    totalSuccess: number;
    totalFail: number;
    totalAssignCases: number;
    totalUnAuthoCases: number;
  };
}>({
  type: 'CREATE_CONFIGURATION_EMAIL',
  visible: false,
});

const filteredList = computed(() =>
  list.value.filter(
    (mailConfig) =>
      mailConfig.name.toLowerCase().includes(filterText.value.toLowerCase()) ||
      mailConfig.domainName?.toLowerCase().includes(filterText.value.toLowerCase())
  )
);
const filteredListByPage = computed(() => {
  const firstIndex = (pagination.current - 1) * pagination.pageSize;
  const lastIndex = pagination.current * pagination.pageSize;
  return filteredList.value.slice(firstIndex, lastIndex);
});

export default function useEmailTemplatesConfiguration() {
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
  function onCheckDefaultEmailConfiguration(email: MailConfiguration) {
    return EMAIL_DEFAULT_UUID.CONFIGURATION === email.uuid;
  }
  function onCloseModal() {
    modal.visible = false;
  }

  function onCreateMailConfiguration(email: MailConfiguration) {
    activeMailConfig.value = email;
    modal.type = 'CREATE_CONFIGURATION_EMAIL';
    modal.visible = true;
  }

  function onDeleteMailConfigurations() {
    modal.type = 'DELETE_CONFIGURATIONS_EMAIL';
    modal.visible = true;
  }

  function onDeleteMailConfigurationsFail(response: {
    total: number;
    totalSuccess: number;
    totalFail: number;
    totalAssignCases: number;
    totalUnAuthoCases: number;
  }) {
    modal.type = 'DELETE_CONFIGURATIONS_FAIL_EMAIL';
    modal.visible = true;
    modal.multipleDeleteResponse = response;
  }

  async function handleGetEmailFooterTemplates(domainUuid: string, onlyCurrentDomain = true) {
    try {
      status.value = STATUS.LOADING;
      const templates = await getMailConfigurationFooterList(domainUuid);
      footerList.value = templates?.map((item) => {
        return { ...item, assigned: isAssigned(item.uuid, currentDomain.value.mailFooter?.uuid) };
      });
    } catch (error) {
      status.value = STATUS.ERROR;
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    } finally {
      status.value = STATUS.SUCCESS;
    }
  }

  async function fetchMailConfiguration(onlyCurrentDomain = true) {
    status.value = STATUS.LOADING;
    try {
      const messages = await getMailConfigurationList(currentDomain.value.uuid, onlyCurrentDomain);
      status.value = STATUS.SUCCESS;
      list.value = messages?.map((item) => {
        return { ...item, assigned: isAssigned(item.uuid, currentDomain.value.mailConfiguration?.uuid) };
      });
    } catch (error) {
      status.value = STATUS.ERROR;

      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
  }

  function isAssigned(MailConfigurationUuid: string, currentDomainMailConfigurationUuid: string | undefined) {
    if (MailConfigurationUuid === currentDomainMailConfigurationUuid) {
      return true;
    }
    return false;
  }

  function onAssignMailConfiguration(MailConfig: MailConfiguration) {
    activeMailConfig.value = MailConfig;
    modal.type = 'ASSIGN_CONFIGURATION_EMAIL';
    modal.visible = true;
  }

  function onDeleteMailConfiguration(MailConfig: MailConfiguration) {
    activeMailConfig.value = MailConfig;
    MailConfigurationUuid.uuid = MailConfig.uuid;
    modal.type = 'DELETE_CONFIGURATION_EMAIL';
    modal.visible = true;
  }

  function onEditMailConfiguration(record: MailConfiguration) {
    activeMailConfig.value = record;
    router.push({ name: CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES.CONFIGURATION_DETAIL, params: { id: record?.uuid } });
  }

  async function handleAssignMailConfiguration(currentDomain: Domain) {
    try {
      if (!activeMailConfig?.value) {
        return false;
      }

      status.value = STATUS.LOADING;
      await assignMailConfiguration(currentDomain.uuid, activeMailConfig.value?.uuid);
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

  async function handleCreateMailConfiguration(payload: {
    name: string;
    domain: string | null;
    domainName: string | undefined;
    mailContentLangs: any[];
    mailFooterLangs: any;
    mailLayout: string | undefined;
    visible: boolean;
    readonly: boolean;
  }) {
    try {
      loading.value = true;
      await createMailConfiguration(payload);
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
  async function handleDeleteMailConfiguration(activeMailConfig: MailConfiguration) {
    try {
      if (!activeMailConfig || !activeMailConfig?.uuid) {
        return false;
      }
      loading.value = true;
      if (activeMailConfig?.assigned) {
        message.error(t('EMAIL_TEMPLATES.DELETE_MODAL.DELETE_ERROR_ASSIGNED'));
        loading.value = false;
        return false;
      }
      await deleteMailConfiguration(MailConfigurationUuid);
      return true;
    } catch (error) {
      if (error instanceof APIError) {
        if (error.errorCode === 16666) {
          message.error(t('EMAIL_TEMPLATES.DELETE_MODAL.DELETE_ERROR_ASSIGNED'));
        } else if (error.errorCode === 166678) {
          message.error(t('EMAIL_TEMPLATES.DELETE_MODAL.DELETE_ERROR_UNAUTHORIZED'));
        } else {
          message.error(error.getMessage());
        }
      }
    } finally {
      loading.value = false;
    }
  }

  async function handleDeleteMailConfigurations() {
    try {
      if (!selectedMailConfigs?.value?.length) {
        message.error(t('MIME_POLICIES.DELETE_MODAL.DELETE_MODAL_EMPTY'));
        return {
          total: selectedMailConfigs?.value?.length,
          totalSuccess: 0,
          totalFail: selectedMailConfigs?.value?.length,
          totalAssignCases: 0,
          totalUnAuthoCases: 0,
        };
      }

      loading.value = true;
      const deletePromises = selectedMailConfigs.value?.map((item) => {
        return deleteMailConfiguration({ uuid: item?.uuid });
      });
      if (!deletePromises) {
        return {
          total: selectedMailConfigs?.value?.length,
          totalSuccess: 0,
          totalFail: selectedMailConfigs?.value?.length,
          totalAssignCases: 0,
          totalUnAuthoCases: 0,
        };
      }

      return await Promise.allSettled(deletePromises).then((results) => {
        return {
          total: selectedMailConfigs?.value?.length,
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
        total: selectedMailConfigs?.value?.length,
        totalSuccess: 0,
        totalFail: selectedMailConfigs?.value?.length,
        totalAssignCases: 0,
        totalUnAuthoCases: 0,
      };
    } finally {
      loading.value = false;
    }
  }
  async function handleGetMailConfigurationDetail(uuid: string) {
    status.value = STATUS.LOADING;
    try {
      const messages = await getMailConfigurationDetail(uuid, currentDomain.value.uuid);
      status.value = STATUS.SUCCESS;
      activeMailConfig.value = messages;
      activeMailConfig.value.selectLanguage = 'ENGLISH';
      languageOptions.value.forEach((item) => {
        mailFooterLangsForm.value[item.value] = { ...activeMailConfig.value.mailFooterLangs[item.value] } ?? {};
        defaultMailFooterLangsForm.value[item.value] = { ...activeMailConfig.value.mailFooterLangs[item.value] } ?? {};
      });

      activeEmailConfigForm.value = {
        uuid: messages?.uuid ?? activeMailConfig.value?.uuid,
        name: messages?.name,
        visible: messages?.visible,
        mailLayout: messages?.mailLayout,
        selectLanguage: activeMailConfig.value.selectLanguage,
      };
      defaultMailConfigurationForm.value = { ...activeEmailConfigForm.value };
    } catch (error) {
      status.value = STATUS.ERROR;

      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
  }
  async function handleGetMailContentList(
    uuid: string | undefined,
    language: string | undefined,
    mailContentType: string | undefined
  ) {
    try {
      const messages = await getMailContentList(uuid, language, mailContentType);
      return messages;
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
      return [];
    }
  }

  async function handleUpdateMailContentLang(payload: MailLang) {
    try {
      await updateMailConfigurationMailContent(payload);
      message.success(t('EMAIL_TEMPLATES.EDIT_FORM.UPDATE_SUCCESS'));
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
      return [];
    }
  }

  async function handleUpdateMailFooterLang(payload: MailLang) {
    try {
      await assignMailFooterToMailConfiguration(payload);
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
      return [];
    }
  }

  async function handleGetLanguageSupport() {
    try {
      const result = await getMailConfigurationLanguagesSupport();
      return result;
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
      return [];
    }
  }

  async function handleUpdateMailConfiguration(payload: MailConfiguration) {
    try {
      Object.keys(mailFooterLangsForm.value).forEach((key) => {
        if (mailFooterLangsForm.value[key].mailFooter !== defaultMailFooterLangsForm.value[key].mailFooter) {
          handleUpdateMailFooterLang(mailFooterLangsForm.value[key]);
        }
      });
      await updateMailConfiguration(payload);
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

  function handleResetEmailConfiguration() {
    activeEmailConfigForm.value = JSON.parse(JSON.stringify(defaultMailConfigurationForm.value));
    mailFooterLangsForm.value = JSON.parse(JSON.stringify(defaultMailFooterLangsForm.value));
  }
  function resetSelectEmailConfiguration() {
    selectedMailConfigs.value = [];
  }

  return {
    list,
    modal,
    status,
    loading,
    footerList,
    pagination,
    filterText,
    filteredList,
    activeMailConfig,
    mailFooterLangsForm,
    activeEmailConfigForm,
    filteredListByPage,
    selectedMailConfigs,
    languageOptions,
    isAssigned,
    onCloseModal,
    fetchMailConfiguration,
    onEditMailConfiguration,
    handleGetLanguageSupport,
    handleGetMailContentList,
    onDeleteMailConfiguration,
    handleUpdateMailFooterLang,
    onAssignMailConfiguration,
    onCreateMailConfiguration,
    onDeleteMailConfigurations,
    handleUpdateMailContentLang,
    handleGetEmailFooterTemplates,
    resetSelectEmailConfiguration,
    handleResetEmailConfiguration,
    handleUpdateMailConfiguration,
    handleAssignMailConfiguration,
    handleDeleteMailConfiguration,
    handleCreateMailConfiguration,
    handleDeleteMailConfigurations,
    onDeleteMailConfigurationsFail,
    onCheckDefaultEmailConfiguration,
    handleGetMailConfigurationDetail,
  };
}
