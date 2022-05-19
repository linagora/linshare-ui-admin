import { ref, reactive, Ref, UnwrapRef } from 'vue';
import { message } from 'ant-design-vue';
import Sort, { SORT_ORDER } from '@/core/types/Sort';
import { DEFAULT_PAGE_SIZE } from '@/core/constants';
import { APIError } from '@/core/types/APIError';
import { MemberListFilters, SharedSpaceMembersListParameter } from '../types/SharedSpaceMember';
import { getSharedSpaceMembers } from '../services//shared-space-api';
import { SharedSpaceMember } from '../types/SharedSpaceMember';
import router from '@/core/router';

const list = ref<SharedSpaceMember[]>([]);
const loading = ref(false);
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: DEFAULT_PAGE_SIZE,
});
const filters = ref<MemberListFilters>({});
const sorter = reactive<Sort>({ order: SORT_ORDER.ASC });

type UsableMemberList = {
  list: Ref<SharedSpaceMember[]>;
  loading: Ref<boolean>;
  sorter: UnwrapRef<Sort>;
  filters: Ref<MemberListFilters>;
  pagination: UnwrapRef<{ total: number; current: number; pageSize: number }>;
  handleTableChange: () => Promise<void>;
};

export default function useSharedSpaceMembersList(): UsableMemberList {
  async function updateMembersList(options: SharedSpaceMembersListParameter) {
    const currentSharedSpace = router.currentRoute.value.params.id;
    if (loading.value) {
      return;
    }

    try {
      loading.value = true;

      const { data, total, current } = await getSharedSpaceMembers(currentSharedSpace, options);

      list.value = data;
      pagination.total = total;
      pagination.current = current + 1;
    } catch (error) {
      message.error((error as APIError).getMessage());
    } finally {
      loading.value = false;
    }
  }

  async function handleTableChange() {
    const parameters: SharedSpaceMembersListParameter = {};

    parameters.size = pagination.pageSize;
    parameters.page = pagination.current ? pagination.current - 1 : 0;
    parameters.pattern = filters.value.pattern;
    parameters.type = filters.value.type;
    parameters.accountUuid = filters.value.accountUuid;
    parameters.roles = filters.value.role;
    parameters.sortField = sorter.field;
    parameters.sortOrder = sorter.order;

    await updateMembersList(parameters);
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
