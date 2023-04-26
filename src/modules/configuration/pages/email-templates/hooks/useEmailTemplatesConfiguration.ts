import { reactive, ref, computed, watch } from 'vue';
import { DEFAULT_PAGE_SIZE } from '@/core/constants';
import { MailConfiguration } from '../types/MailConfiguration';
import { message } from 'ant-design-vue';
import { APIError } from '@/core/types/APIError';
import { STATUS } from '@/core/types/Status';
import { useI18n } from 'vue-i18n';
import {
  getMailConfigurationList,
  assignMailConfiguration,
  createMailConfiguration,
} from '../services/email-templates-api';
import { storeToRefs } from 'pinia';
import { useDomainStore } from '@/modules/domain/store';
import Domain from '@/core/types/Domain';
import { useLocalStorage } from '@vueuse/core';

const activeMailConfig = useLocalStorage<MailConfiguration>(
  'configuration-type-mail-config-activeMailConfig',
  {} as MailConfiguration
);
const list = ref<MailConfiguration[]>([]);
const filterText = ref('');
const status = ref(STATUS.LOADING);
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: DEFAULT_PAGE_SIZE,
});
const modal = reactive<{
  type: 'CREATE_CONFIGURATION_EMAIL' | 'ASSIGN_CONFIGURATION_EMAIL';
  visible: boolean;
}>({
  type: 'CREATE_CONFIGURATION_EMAIL',
  visible: false,
});

const filteredList = computed(() =>
  list.value.filter((mailConfig) => mailConfig.name.toLowerCase().includes(filterText.value.toLowerCase()))
);
const filteredListByPage = computed(() => {
  const firstIndex = (pagination.current - 1) * pagination.pageSize;
  const lastIndex = pagination.current * pagination.pageSize;
  return filteredList.value.slice(firstIndex, lastIndex);
});

export default function useEmailTemplatesConfiguration() {
  // composable
  const { t } = useI18n();
  const { currentDomain } = storeToRefs(useDomainStore());

  // data
  const loading = ref(false);

  watch(filteredList, async (newVal) => {
    pagination.total = newVal.length;
  });

  function onCloseModal() {
    modal.visible = false;
  }

  function onCreateMailConfiguration(email: MailConfiguration) {
    activeMailConfig.value = email;
    modal.type = 'CREATE_CONFIGURATION_EMAIL';
    modal.visible = true;
  }

  async function fetchMailConfiguration() {
    status.value = STATUS.LOADING;
    try {
      const messages = await getMailConfigurationList(currentDomain.value.uuid, false);
      status.value = STATUS.SUCCESS;
      list.value = messages;
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

  function onAssignMimePolicy(MailConfig: MailConfiguration) {
    activeMailConfig.value = MailConfig;
    modal.type = 'ASSIGN_CONFIGURATION_EMAIL';
    modal.visible = true;
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

  return {
    list,
    modal,
    status,
    loading,
    pagination,
    filterText,
    filteredList,
    filteredListByPage,
    isAssigned,
    onCloseModal,
    onAssignMimePolicy,
    fetchMailConfiguration,
    onCreateMailConfiguration,
    handleAssignMailConfiguration,
    handleCreateMailConfiguration,
  };
}
