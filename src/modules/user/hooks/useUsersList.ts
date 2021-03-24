import { ref, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { TableState, TableStateFilters } from 'ant-design-vue/es/table/interface';

import User from '@/modules/user/type/User';
import UserAPIClient, { ListUsersOptions } from '@/modules/user/services/UserAPIClient';

type Pagination = TableState['pagination'];

const list = ref<User[]>([]);
const loading = ref(false);
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: 10
});

export default function useUsersList () {
  const { t } = useI18n();

  async function updateUsersList (options: ListUsersOptions) {
    if (loading.value) {
      return;
    }

    try {
      loading.value = true;

      const { data, total, current } = await UserAPIClient.listUsers(options);

      list.value = data;
      pagination.total = total;
      pagination.current = current + 1;
    } catch (error) {
      message.error(error.message || t('ERRORS.COMMON_MESSAGE'));
      console.error(error);
    } finally {
      loading.value = false;
    }
  }

  async function handleTableChange (pag: Pagination, filters?: TableStateFilters, sorter?: any) {
    const options: ListUsersOptions = {};

    if (pag) {
      options.size = pag.pageSize;
      options.page = pag.current ? pag.current - 1 : 0;
    }

    if (sorter) {
      options.sortField = sorter.field;
      options.sortOrder = sorter.order === 'descend' ? 'DESC' : 'ASC';
    }

    await updateUsersList(options);
  };

  async function handlePaginationChange (page: number, size: number) {
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
    handlePaginationChange
  };
};
