import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { STATUS } from '@/core/types/Status';
import { MailLayout } from '../types/MailLayout';
import message from 'ant-design-vue/lib/message';
import { APIError } from '@/core/types/APIError';
import { DEFAULT_PAGE_SIZE } from '@/core/constants';
import { createMailLayout, getLayoutEmailTemplates } from '../services/email-templates-api';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/modules/auth/store';
import { ACCOUNT_ROLE } from '@/modules/user/types/User';
import { useDomainStore } from '@/modules/domain/store';

const list = ref<MailLayout[]>([]);
const status = ref(STATUS.LOADING);
const loading = ref(false);
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: DEFAULT_PAGE_SIZE,
});
const filterText = ref('');

const modal = reactive<{
  type: 'CREATE_LAYOUT_EMAIL';

  visible: boolean;
}>({
  type: 'CREATE_LAYOUT_EMAIL',
  visible: false,
});

export default function useEmailTemplatesLayout() {
  const { loggedUserRole } = storeToRefs(useAuthStore());
  const { getDomainsList } = storeToRefs(useDomainStore());
  const { t } = useI18n();

  async function handleGetEmailLayoutTemplates(domainUuid: string) {
    try {
      status.value = STATUS.LOADING;
      const templates = await getLayoutEmailTemplates(domainUuid, true);
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

  function onCloseModal() {
    modal.visible = false;
  }

  return {
    status,
    list,
    pagination,
    filterText,
    handleGetEmailLayoutTemplates,
    checkingEmailLayoutsDomainAuthorized,
    modal,
    onCloseModal,
    handleCreateMailLayout,
    loading,
  };
}
