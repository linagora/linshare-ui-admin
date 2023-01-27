import { computed, ComputedRef, reactive, Ref, ref, UnwrapRef, watch } from 'vue';
import { DEFAULT_PAGE_SIZE } from '@/core/constants';
import WelcomeMessage from '../types/WelcomeMessages';
import { getWelcomeMessages, assignWelcomeMessage, deleteWelcomeMessage } from '../services/welcome-messages-api';
import { storeToRefs } from 'pinia';
import { useDomainStore } from '@/modules/domain/store';
import { message } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { APIError } from '@/core/types/APIError';
import { useRouter } from 'vue-router';
import { STATUS } from '@/core/types/Status';
import config from '@/config';

type UsableWelcomeMessages = {
  list: Ref<WelcomeMessage[]>;
  filteredList: ComputedRef<WelcomeMessage[]>;
  filteredListByPage: ComputedRef<WelcomeMessage[]>;
  filterText: Ref<string>;
  loading: Ref<boolean>;
  status: Ref<STATUS>;
  pagination: UnwrapRef<{ total: number; current: number; pageSize: number }>;
  fetchWelcomeMessages: () => Promise<void>;
  assign: (message: WelcomeMessage) => Promise<void>;
  remove: (message: WelcomeMessage) => Promise<void>;
  view: (message: WelcomeMessage) => void;
  dupplicate: (message: WelcomeMessage) => void;
  canDeleteMessage: (message: WelcomeMessage) => boolean;
};

const loading = ref(false);
const filterText = ref('');
const status = ref(STATUS.LOADING);
const list = ref<WelcomeMessage[]>([]);
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: DEFAULT_PAGE_SIZE,
});
const filteredList = computed(() =>
  list.value.filter((message) => message.name.toLowerCase().includes(filterText.value.toLowerCase()))
);
const rootWelcomeMessageUuid = config.rootWelcomeMessageUuid;

const filteredListByPage = computed(() => {
  const firstIndex = (pagination.current - 1) * pagination.pageSize;
  const lastIndex = pagination.current * pagination.pageSize;
  return filteredList.value.slice(firstIndex, lastIndex);
});

export default function useWelcomeMessages(): UsableWelcomeMessages {
  const { t } = useI18n();
  const { push } = useRouter();
  const domainStore = useDomainStore();
  const { currentDomain } = storeToRefs(domainStore);

  watch(filteredList, async (newVal) => {
    pagination.total = newVal.length;
  });

  async function fetchWelcomeMessages() {
    status.value = STATUS.LOADING;

    try {
      const messages = await getWelcomeMessages(currentDomain.value.uuid);

      status.value = STATUS.SUCCESS;
      list.value = messages;
    } catch (error) {
      status.value = STATUS.ERROR;

      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
  }

  async function assign(welcomeMessage: WelcomeMessage) {
    try {
      await assignWelcomeMessage(currentDomain.value.uuid, welcomeMessage.uuid);
      message.success(t('WELCOME_MESSAGES.ASSIGN_SUCCESS'));
      list.value.forEach((element) => {
        if (element.uuid === welcomeMessage.uuid) {
          element.assignedToCurrentDomain = true;
          return;
        }
        element.assignedToCurrentDomain = false;
      });
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
  }

  async function remove(welcomeMessage: WelcomeMessage) {
    try {
      await deleteWelcomeMessage(currentDomain.value.uuid, welcomeMessage.uuid);
      message.success(t('MESSAGES.DELETE_SUCCESS'));
      list.value = list.value.filter((message) => message.uuid !== welcomeMessage.uuid);
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
  }

  function view(welcomeMessage: WelcomeMessage) {
    push({ name: 'DomainWelcomeMessageDetails', params: { uuid: welcomeMessage.uuid } });
  }

  function dupplicate(welcomeMessage: WelcomeMessage) {
    push({ name: 'DomainWelcomeMessageNew', query: { duplicate: welcomeMessage.uuid } });
  }

  function canDeleteMessage(welcomeMessage: WelcomeMessage) {
    return (
      !welcomeMessage.readOnly &&
      welcomeMessage.uuid !== rootWelcomeMessageUuid &&
      welcomeMessage.assignedToCurrentDomain === false
    );
  }

  return {
    list,
    filteredList,
    filterText,
    loading,
    status,
    pagination,
    filteredListByPage,
    fetchWelcomeMessages,
    assign,
    remove,
    view,
    dupplicate,
    canDeleteMessage,
  };
}
