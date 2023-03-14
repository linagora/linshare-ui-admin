import { ref, reactive, Ref, UnwrapRef } from 'vue';
import { message } from 'ant-design-vue';
import SharedSpace from '@/modules/shared-spaces/types/SharedSpace';
import { SharedSpaceListParameters, SharedSpaceListFilters } from '@/modules/shared-spaces/types/ShareSpaceList';
import { getSharedSpace, listSharedSpaces } from '../services/shared-space-api';
import { DEFAULT_PAGE_SIZE } from '@/core/constants';
import Sort, { SORT_ORDER } from '@/core/types/Sort';
import { APIError } from '@/core/types/APIError';
import { useAuthStore } from '@/modules/auth/store';
import { storeToRefs } from 'pinia';

interface Pagination {
  total: number;
  current: number;
  pageSize: number;
}

const list = ref<SharedSpace[]>([]);
const authStore = useAuthStore();
const { loggedUser } = storeToRefs(authStore);
const loading = ref(false);
const filters = ref<SharedSpaceListFilters>({});
const sorter = reactive<Sort>({ order: SORT_ORDER.DESC });
const pagination = reactive<Pagination>({
  total: 0,
  current: 1,
  pageSize: DEFAULT_PAGE_SIZE,
});

type UsableSharedSpacesList = {
  list: Ref<SharedSpace[]>;
  loading: Ref<boolean>;
  sorter: UnwrapRef<Sort>;
  filters: Ref<SharedSpaceListFilters>;
  pagination: UnwrapRef<{ total: number; current: number; pageSize: number }>;
  handleTableChange: () => Promise<void>;
  reset: () => void;
};

export default function useSharedSpacesList(): UsableSharedSpacesList {
  async function populateParentWorkspaces(list: SharedSpace[]): Promise<void> {
    const workspaces = list.filter((sharedSpace) => sharedSpace.nodeType === 'WORK_SPACE');

    for (let index = 0; index < list.length; index++) {
      const sharedSpace = list[index];
      let workspace;

      if (sharedSpace.parentUuid) {
        try {
          workspace = workspaces.find((node) => node.uuid === sharedSpace.parentUuid);

          if (!workspace) {
            workspace = await getSharedSpace(sharedSpace.parentUuid);
            workspaces.push(workspace);
          }

          sharedSpace.parentName = workspace.name;
        } catch (error) {
          message.error((error as APIError).getMessage());
        }
      }
    }
  }

  async function updateSharedSpacesList(options: SharedSpaceListParameters) {
    if (loading.value) {
      return;
    }

    try {
      loading.value = true;

      const { data, total, current } = await listSharedSpaces(options);

      await populateParentWorkspaces(data);
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
    const parameters: SharedSpaceListParameters = {};

    parameters.size = pagination.pageSize;
    parameters.page = pagination.current ? pagination.current - 1 : 0;
    parameters.account =
      filters.value.account != undefined || loggedUser.value?.accountType === 'ROOT'
        ? filters.value.account
        : loggedUser.value?.uuid;
    parameters.domains = filters.value.domains;
    parameters.name = filters.value.name;
    parameters.nodeType = filters.value.nodeType;
    parameters.sortField = sorter.field;
    parameters.sortOrder = sorter.order;
    await updateSharedSpacesList(parameters);
  }

  function reset() {
    filters.value = {};
    sorter.order = SORT_ORDER.ASC;
  }

  return {
    list,
    loading,
    pagination,
    handleTableChange,
    reset,
    filters,
    sorter,
  };
}
