import { computed, reactive, ref } from 'vue';
import { STATUS } from '@/core/types/Status';
import { MailLayout } from '../types/MailLayout';
import message from 'ant-design-vue/lib/message';
import { APIError } from '@/core/types/APIError';
import { DEFAULT_PAGE_SIZE } from '@/core/constants';
import { getLayoutEmailTemplates } from '../services/email-templates-api';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/modules/auth/store';
import { ACCOUNT_ROLE } from '@/modules/user/types/User';
import { useDomainStore } from '@/modules/domain/store';

const list = ref<MailLayout[]>([]);
const status = ref(STATUS.LOADING);
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: DEFAULT_PAGE_SIZE,
});
const filterText = ref('');

export default function useEmailTemplatesLayout() {
  const { loggedUserRole } = storeToRefs(useAuthStore());
  const { getDomainsList, currentDomain } = storeToRefs(useDomainStore());

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

  function checkingMimePolicyDomainAuthorized(domainUuid: string) {
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

  return {
    status,
    list,
    pagination,
    filterText,
    handleGetEmailLayoutTemplates,
    checkingMimePolicyDomainAuthorized,
  };
}
