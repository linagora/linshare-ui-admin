import { ref, reactive, Ref, UnwrapRef } from 'vue';
import { message } from 'ant-design-vue';

import SharedSpace from '@/modules/shared-spaces/types/SharedSpace';
import { getSharedSpace, listSharedSpaces, ListSharedSpaceOptions } from '../services/shared-space-api';
import { DEFAULT_PAGE_SIZE } from '@/core/constants';
import { APIError } from '@/core/types/APIError';

interface Pagination {
  total: number;
  current: number;
  pageSize: number;
}

const list = ref<SharedSpace[]>([]);
const loading = ref(false);
const pagination = reactive<Pagination>({
  total: 0,
  current: 1,
  pageSize: DEFAULT_PAGE_SIZE,
});

type UsableSharedSpacesList = {
  list: Ref<SharedSpace[]>;
  loading: Ref<boolean>;
  pagination: UnwrapRef<{ total: number; current: number; pageSize: number }>;
  handlePaginationChange: (pagination: Pagination) => Promise<void>;
  updateSharedSpacesList: (options: ListSharedSpaceOptions) => Promise<void>;
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
          if (error instanceof APIError) {
            message.error(error.getMessage());
          }
        }
      }
    }
  }

  async function updateSharedSpacesList(options: ListSharedSpaceOptions) {
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

  async function handlePaginationChange(pagination: Pagination) {
    const options: ListSharedSpaceOptions = {};

    options.page = pagination.current - 1;
    options.size = pagination.pageSize;

    await updateSharedSpacesList(options);
  }

  return {
    list,
    loading,
    pagination,
    handlePaginationChange,
    updateSharedSpacesList,
  };
}
