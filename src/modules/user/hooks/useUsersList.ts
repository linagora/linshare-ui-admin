import { ref, reactive, Ref, UnwrapRef } from 'vue';
import { message } from 'ant-design-vue';
import { TableState } from 'ant-design-vue/es/table/interface';

import User from '@/modules/user/types/User';
import { listUsers, ListUsersOptions, ListUserFilters } from '@/modules/user/services/user-api';
import Sort from '@/core/types/Sort';
import { DEFAULT_PAGE_SIZE } from '@/core/constants';
import { APIError } from '@/core/types/APIError';

type Pagination = TableState['pagination'];

const list = ref<User[]>([]);
const loading = ref(false);
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: DEFAULT_PAGE_SIZE,
});

type UsableUsersList = {
  list: Ref<User[]>;
  loading: Ref<boolean>;
  pagination: UnwrapRef<{ total: number; current: number; pageSize: number }>;
  handleTableChange: (pag: Pagination, filters?: ListUserFilters, sorter?: Sort) => Promise<void>;
  handlePaginationChange: (page: number, size: number) => Promise<void>;
};

export default function useUsersList(): UsableUsersList {
  async function updateUsersList(options: ListUsersOptions) {
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
      } else {
        console.error(error);
      }
    } finally {
      loading.value = false;
    }
  }

  async function handleTableChange(pag: Pagination, filters?: ListUserFilters, sorter?: Sort) {
    const options: ListUsersOptions = {};

    if (pag) {
      options.size = pag.pageSize;
      options.page = pag.current ? pag.current - 1 : 0;
    }

    if (filters) {
      options.domain = filters.domain;
      options.firstName = filters.firstName;
      options.lastName = filters.lastName;
      options.mail = filters.mail;
      options.role = filters.role;
      options.type = filters.type;
      options.restricted = filters.restricted;
      options.canUpload = filters.canUpload;
      options.canCreateGuest = filters.canCreateGuest;
    }

    if (sorter) {
      options.sortField = sorter.field;
      options.sortOrder = sorter.order;
    }

    await updateUsersList(options);
  }

  async function handlePaginationChange(page: number, size: number) {
    const options: ListUsersOptions = {};

    options.page = page - 1;
    options.size = size;

    await updateUsersList(options);
  }

  return {
    list,
    loading,
    pagination,
    handleTableChange,
    handlePaginationChange,
  };
}
