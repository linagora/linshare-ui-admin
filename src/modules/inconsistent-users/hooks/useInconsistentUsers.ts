import { reactive, ref, computed, watch, Ref, UnwrapRef } from 'vue';
import { DEFAULT_PAGE_SIZE } from '@/core/constants';
import {
  InconsistentUsers,
  InconsistentUsersListFilters,
  InconsistentUsersListParameters,
} from '../types/InconsistentUsers';
import { message } from 'ant-design-vue';
import { APIError } from '@/core/types/APIError';
import { STATUS } from '@/core/types/Status';
import { useI18n } from 'vue-i18n';
import { getInconsistentUsersList, migrateUser } from '../services/inconsistent-users-api';
import Sort, { SORT_ORDER } from '@/core/types/Sort';
import { filter } from 'lodash-es';

type UsableUsersList = {
  list: Ref<InconsistentUsers[]>;
  sorter: UnwrapRef<Sort>;
  filters: Ref<InconsistentUsersListFilters>;
  pagination: UnwrapRef<{ total: number; current: number; pageSize: number }>;
  handleTableChange: () => Promise<void>;
  fetchInconsistentUsersList: () => Promise<void>;
  handleMigrateInconsistentUsers: (
    payload: InconsistentUsers[],
    domain: { label: string; value: string }
  ) => Promise<boolean | undefined>;
  reset: () => void;
  resetFilters: () => void;
  filterText: UnwrapRef<{
    lastName: string | undefined;
    firstName: string | undefined;
    domain: string | undefined;
    mail: string | undefined;
  }>;
  filteredList: Ref<InconsistentUsers[]>;
  loading: Ref<boolean>;
  filteredListByPage: Ref<InconsistentUsers[]>;
};

const list = ref<InconsistentUsers[]>([]);
const filters = ref<InconsistentUsersListFilters>({});
const sorter = reactive<Sort>({ order: SORT_ORDER.ASC });
const filterText = reactive({
  lastName: '',
  firstName: '',
  domain: '',
  mail: '',
});
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: DEFAULT_PAGE_SIZE,
});
const loading = ref(false);

const filteredList = computed(() => {
  return list.value.filter((inconsistentUser) => {
    const lastNameMatch =
      filterText.lastName !== '' && filterText.lastName !== undefined
        ? inconsistentUser.lastName.toLowerCase().includes(filterText.lastName.toLowerCase())
        : true;
    const firstNameMatch =
      filterText.firstName !== '' && filterText.firstName !== undefined
        ? inconsistentUser.firstName.toLowerCase().includes(filterText.firstName.toLowerCase())
        : true;
    const mailMatch =
      filterText.mail !== '' && filterText.mail !== undefined
        ? inconsistentUser.mail.toLowerCase().includes(filterText.mail.toLowerCase())
        : true;
    const domainMatch =
      filterText.domain !== '' && filterText.domain !== undefined
        ? inconsistentUser.domain.toLowerCase().includes(filterText.domain.toLowerCase()) ||
          inconsistentUser.domainName.toLowerCase().includes(filterText.domain.toLowerCase())
        : true;

    return lastNameMatch && firstNameMatch && mailMatch && domainMatch;
  });
});

const filteredListByPage = computed(() => {
  const firstIndex = (pagination.current - 1) * pagination.pageSize;
  const lastIndex = pagination.current * pagination.pageSize;
  return filteredList.value.slice(firstIndex, lastIndex);
});

export default function useInconsistentUsers(): UsableUsersList {
  const { t } = useI18n();

  watch(filteredList, async (newVal) => {
    pagination.total = newVal.length;
  });

  async function fetchInconsistentUsersList() {
    loading.value = true;
    try {
      const datas = await getInconsistentUsersList();
      list.value = datas;
      loading.value = false;
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
  }

  async function handleMigrateInconsistentUsers(payload: InconsistentUsers[], domain: object) {
    try {
      loading.value = true;

      const migratePromises = payload.map((item) => {
        item.domain = domain.value;
        item.domainName = domain.label;

        return migrateUser(item);
      });
      if (!migratePromises) {
        return;
      }
      const responses = await Promise.all(migratePromises);

      if (responses) {
        message.success(t('MESSAGES.UPDATE_SUCCESS'));
        return true;
      }
      return false;
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
      return false;
    } finally {
      loading.value = false;
      pagination.current === 1 ? (pagination.current = 1) : pagination.current--;
    }
  }

  async function handleTableChange() {
    const parameters: InconsistentUsersListParameters = {};

    parameters.size = pagination.pageSize;
    parameters.page = pagination.current ? pagination.current - 1 : 0;
    parameters.domainId = filters.value.domains;
    parameters.firstName = filters.value.firstName;
    parameters.lastName = filters.value.lastName;
    parameters.mail = filters.value.email;
    parameters.sortField = sorter.field;
    parameters.sortOrder = sorter.order;
  }

  function reset() {
    filters.value = {};
    sorter.order = SORT_ORDER.ASC;
  }

  function resetFilters() {
    filters.value = {};
    filterText.lastName = '';
    filterText.firstName = '';
    filterText.domain = '';
    filterText.mail = '';
  }

  return {
    fetchInconsistentUsersList,
    handleMigrateInconsistentUsers,
    list,
    filters,
    sorter,
    handleTableChange,
    loading,
    reset,
    resetFilters,
    pagination,
    filterText,
    filteredList,
    filteredListByPage,
  };
}
