import { ref, reactive, Ref, UnwrapRef } from 'vue';
import { message } from 'ant-design-vue';
import Sort, { SORT_ORDER } from '@/core/types/Sort';
import { DEFAULT_PAGE_SIZE } from '@/core/constants';
import { APIError } from '@/core/types/APIError';
import { listGuestsThatUserIsModeratorOf } from '../services/user-api';
import { GuestListFilters, GuestListParameters } from '../types/GuestList';
import type { Guest } from '@/modules/user/types/GuestList';
import { useRoute } from 'vue-router';

const list = ref<Guest[]>([]);
const loading = ref(false);
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: DEFAULT_PAGE_SIZE,
});
const filters = ref<GuestListFilters>({});
const sorter = reactive<Sort>({ order: SORT_ORDER.ASC });

type UsableGuestList = {
  list: Ref<Guest[]>;
  loading: Ref<boolean>;
  sorter: UnwrapRef<Sort>;
  filters: Ref<GuestListFilters>;
  pagination: UnwrapRef<{ total: number; current: number; pageSize: number }>;
  handleTableChange: () => Promise<void>;
};

export default function useGuestList(): UsableGuestList {
  const route = useRoute();

  async function updateGuestList(options: GuestListParameters) {
    const currentUser = route.params.id;
    if (loading.value) {
      return;
    }

    try {
      loading.value = true;

      const data = await listGuestsThatUserIsModeratorOf(options, currentUser);

      list.value = data;
      pagination.total = list.value.length;
    } catch (error) {
      message.error((error as APIError).getMessage());
    } finally {
      loading.value = false;
    }
  }

  async function handleTableChange() {
    const parameters: GuestListParameters = {};

    parameters.size = pagination.pageSize;
    parameters.page = pagination.current ? pagination.current - 1 : 0;
    parameters.pattern = filters.value.pattern;
    parameters.role = filters.value.role;
    parameters.sortField = sorter.field;
    parameters.sortOrder = sorter.order;

    await updateGuestList(parameters);
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
