import { reactive, ref, computed, watch } from 'vue';
import { DEFAULT_PAGE_SIZE } from '@/core/constants';
import { Contact, ContactInfo } from '../types/Contact';
import { message } from 'ant-design-vue';
import { APIError } from '@/core/types/APIError';
import { STATUS } from '@/core/types/Status';
import {
  getContactList,
  getContactListDetail,
  deleteContactList,
  updateContactList,
  addContactListEmail,
} from '../services/contact-list-api';
import { useLocalStorage } from '@vueuse/core';
import { CONTACT_LISTS_ROUTE_NAMES } from '../router';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Sort, { SORT_ORDER } from '@/core/types/Sort';
import { ContactListFilters, ContactListParameters } from '../types/Contact';

const activeContactList = useLocalStorage<Contact>('configuration-contact-list', {} as Contact);
const activeContactListForm = ref<Partial<Contact>>({});
const defaultContactListForm = ref<Partial<Contact>>({});
const selectedContactLists = ref<Contact[]>();
const filters = ref<ContactListFilters>({});
const sorter = reactive<Sort>({ order: SORT_ORDER.ASC });

const list = ref<Contact[]>([]);
const filterText = ref('');
const filterMail = ref('');
const status = ref(STATUS.LOADING);
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: DEFAULT_PAGE_SIZE,
});
const loading = ref(false);

const modal = reactive<{
  type:
    | 'CREATE_CONTACT_LIST'
    | 'ASSIGN_CONTACT_LIST'
    | 'DELETE_CONTACT_LIST'
    | 'DELETE_CONTACT_LISTS'
    | 'DELETE_CONTACT_LIST_FAIL';
  visible: boolean;
  multipleDeleteResponse?: {
    total: number;
    totalSuccess: number;
    totalFail: number;
    totalAssignCases: number;
    totalUnAuthoCases: number;
  };
}>({
  type: 'CREATE_CONTACT_LIST',
  visible: false,
});

const filteredList = computed(() =>
  list.value
    .filter(
      (contactList: Contact) =>
        contactList?.identifier?.toLowerCase().includes(filterText.value.toLowerCase()) ||
        contactList?.description?.toLowerCase().includes(filterText.value.toLowerCase())
    )
    .sort((a: Contact, b: Contact) => a.identifier.localeCompare(b.identifier))
);
const filteredListByPage = computed(() => {
  const firstIndex = (pagination.current - 1) * pagination.pageSize;
  const lastIndex = pagination.current * pagination.pageSize;
  return filteredList.value.slice(firstIndex, lastIndex);
});

export default function useContactList() {
  const router = useRouter();
  const { t } = useI18n();

  watch(filteredList, async (newVal) => {
    pagination.total = newVal.length;
    pagination.current =
      pagination.current * pagination.pageSize > pagination.total
        ? Math.floor(pagination.total / pagination.pageSize) || 1
        : pagination.current;
  });

  //methods
  function onCloseModal() {
    modal.visible = false;
  }

  function onDeleteContact() {
    modal.visible = true;
    modal.type = 'DELETE_CONTACT_LIST';
  }

  async function fetchContactList(options: ContactListParameters) {
    status.value = STATUS.LOADING;
    try {
      const messages = await getContactList(options);
      status.value = STATUS.SUCCESS;
      list.value = messages;
    } catch (error) {
      status.value = STATUS.ERROR;

      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
  }

  function onEditContactList(record: Contact) {
    activeContactList.value = record;
    router.push({ name: CONTACT_LISTS_ROUTE_NAMES.CONTACT_LIST_DETAIL, params: { id: record?.uuid } });
  }

  function handleResetContactList() {
    activeContactListForm.value = JSON.parse(JSON.stringify(defaultContactListForm.value));
  }

  async function handleGetContactListDetail(identifier: string) {
    status.value = STATUS.LOADING;
    try {
      const messages = await getContactListDetail(identifier);
      status.value = STATUS.SUCCESS;
      activeContactList.value = messages;

      activeContactListForm.value = {
        ...messages,
      };
      defaultContactListForm.value = { ...activeContactListForm.value };
    } catch (error) {
      status.value = STATUS.ERROR;

      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
  }

  async function handleDeleteContactList(contact: Contact) {
    status.value = STATUS.LOADING;
    try {
      const messages = await deleteContactList(contact);
      status.value = STATUS.SUCCESS;
      onCloseModal();
      router.push({ name: CONTACT_LISTS_ROUTE_NAMES.CONTACT_LIST });
    } catch (error) {
      status.value = STATUS.ERROR;

      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
  }

  async function handleEditContactList(contact: Contact) {
    loading.value = true;
    status.value = STATUS.LOADING;
    try {
      await updateContactList(contact);
      status.value = STATUS.SUCCESS;
      message.success(t(`MESSAGES.UPDATE_SUCCESS`));
    } catch (error) {
      status.value = STATUS.ERROR;

      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    } finally {
      loading.value = false;
    }
  }

  async function handleAddContactListEmail(uuid: string, contact: ContactInfo) {
    loading.value = true;
    status.value = STATUS.LOADING;
    try {
      await addContactListEmail(uuid, contact);
      status.value = STATUS.SUCCESS;
      message.success(t(`CONTACT_LIST.ADD_CONTACT_SUCCESS`));
      return true;
    } catch (error) {
      status.value = STATUS.ERROR;

      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
      return false;
    } finally {
      loading.value = false;
    }
  }

  function resetSelectContactList() {
    filters.value = {};
    sorter.order = SORT_ORDER.ASC;
    selectedContactLists.value = [];
  }

  async function handleTableChange() {
    const parameters: ContactListParameters = {};
    parameters.domainUuid = filters.value.domainUuid;
    parameters.ownerUuid = filters.value.ownerUuid;
    parameters.memberMail = filters.value.memberMail;
    await fetchContactList(parameters);
  }

  return {
    list,
    modal,
    status,
    loading,
    pagination,
    filterText,
    filteredList,
    activeContactList,
    activeContactListForm,
    filteredListByPage,
    selectedContactLists,
    onCloseModal,
    fetchContactList,
    onEditContactList,
    onDeleteContact,
    handleEditContactList,
    resetSelectContactList,
    handleResetContactList,
    handleDeleteContactList,
    handleGetContactListDetail,
    handleTableChange,
    handleAddContactListEmail,
    filters,
    sorter,
    filterMail,
  };
}
