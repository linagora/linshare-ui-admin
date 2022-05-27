import { ref, reactive, Ref, UnwrapRef } from 'vue';
import { message } from 'ant-design-vue';

import Sort, { SORT_ORDER } from '@/core/types/Sort';
import { DEFAULT_PAGE_SIZE } from '@/core/constants';
import { APIError } from '@/core/types/APIError';
import { listUsers } from '../services/user-api';
import { UsersListFilters, UsersListParameters } from '../types/UsersList';
import User from '../types/User';

const list = ref<User[]>([]);
const loading = ref(false);
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: DEFAULT_PAGE_SIZE,
});
const filters = reactive<UsersListFilters>({});
const sorter = reactive<Sort>({ order: SORT_ORDER.ASC });

type UsableUsersList = {
  list: Ref<User[]>;
  loading: Ref<boolean>;
  sorter: UnwrapRef<Sort>;
  filters: UnwrapRef<UsersListFilters>;
  pagination: UnwrapRef<{ total: number; current: number; pageSize: number }>;
  handleTableChange: () => Promise<void>;
};

export default function useUsersList(): UsableUsersList {
  async function updateUsersList(options: UsersListParameters) {
    if (loading.value) {
      return;
    }

    try {
      loading.value = true;

      const { data, total, current } = await listUsers(options);

      list.value = data;
      pagination.total = total;
      pagination.current = current + 1;
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    } finally {
      loading.value = false;
    }
  }

  async function handleTableChange() {
    const parameters: UsersListParameters = {};

    parameters.size = pagination.pageSize;
    parameters.page = pagination.current ? pagination.current - 1 : 0;
    parameters.domain = filters.domain;
    parameters.firstName = filters.firstName;
    parameters.lastName = filters.lastName;
    parameters.mail = filters.mail;
    parameters.role = filters.role;
    parameters.type = filters.type;
    parameters.restricted = filters.restricted;
    parameters.canUpload = filters.canUpload;
    parameters.canCreateGuest = filters.canCreateGuest;
    parameters.sortField = sorter.field;
    parameters.sortOrder = sorter.order;

    await updateUsersList(parameters);
  }

  return {
    list,
    loading,
    filters,
    sorter,
    pagination,
    handleTableChange,
  };
}
