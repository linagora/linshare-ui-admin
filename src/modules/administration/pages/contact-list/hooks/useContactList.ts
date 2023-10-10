import { reactive, ref, computed, watch } from 'vue';
import { DEFAULT_PAGE_SIZE } from '@/core/constants';
import { Contact } from '../types/Contact';
import { message } from 'ant-design-vue';
import { APIError } from '@/core/types/APIError';
import { STATUS } from '@/core/types/Status';
import { getContactList } from '../services/contact-list-api';
import { useLocalStorage } from '@vueuse/core';

const activeContactList = useLocalStorage<Contact>('configuration-contact-list', {} as Contact);
const activeContactListForm = ref<Partial<Contact>>({});
const defaultContactListForm = ref<Partial<Contact>>({});
const selectedContactLists = ref<Contact[]>();

const list = ref<Contact[]>([]);
const filterText = ref('');
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
  list.value.filter(
    (contactList: Contact) =>
      contactList?.identifier?.toLowerCase().includes(filterText.value.toLowerCase()) ||
      contactList?.description?.toLowerCase().includes(filterText.value.toLowerCase())
  )
);
const filteredListByPage = computed(() => {
  const firstIndex = (pagination.current - 1) * pagination.pageSize;
  const lastIndex = pagination.current * pagination.pageSize;
  return filteredList.value.slice(firstIndex, lastIndex);
});

export default function useContactList() {
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

  async function fetchContactList() {
    status.value = STATUS.LOADING;
    try {
      const messages = await getContactList();
      status.value = STATUS.SUCCESS;
      list.value = messages;
    } catch (error) {
      status.value = STATUS.ERROR;

      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
  }

  function handleResetContactList() {
    activeContactListForm.value = JSON.parse(JSON.stringify(defaultContactListForm.value));
  }
  function resetSelectContactList() {
    selectedContactLists.value = [];
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
    resetSelectContactList,
    handleResetContactList,
  };
}
