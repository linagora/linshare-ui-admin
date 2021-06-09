import { ref, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';

import SharedSpace from '@/modules/shared-spaces/type/SharedSpace';
import SharedSpaceAPIClient, { ListSharedSpaceOptions } from '@/modules/shared-spaces/services/SharedSpaceAPIClient';
import { DEFAULT_PAGE_SIZE } from '@/core/constants';

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
  pageSize: DEFAULT_PAGE_SIZE
});

export default function useSharedSpacesList () {
  const { t } = useI18n();

  async function populateParentDrives (list: SharedSpace[]): Promise<void> {
    const drives = list.filter(sharedSpace => sharedSpace.nodeType === 'DRIVE');

    for (let index = 0; index < list.length; index++) {
      const sharedSpace = list[index];
      let drive;

      if (sharedSpace.parentUuid) {
        try {
          drive = drives.find(node => node.uuid === sharedSpace.parentUuid);

          if (!drive) {
            drive = await SharedSpaceAPIClient.getSharedSpace(sharedSpace.parentUuid);
            drives.push(drive);
          }

          sharedSpace.parentName = drive.name;
        } catch (error) {
          console.debug('Failed to get parent drive', error);
        }
      }
    }
  }

  async function updateSharedSpacesList (options: ListSharedSpaceOptions) {
    if (loading.value) {
      return;
    }

    try {
      loading.value = true;

      const { data, total, current } = await SharedSpaceAPIClient.listSharedSpaces(options);

      await populateParentDrives(data);

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

  async function handlePaginationChange (pagination: Pagination) {
    const options: ListSharedSpaceOptions = {};

    options.page = pagination.current - 1;
    options.size = pagination.pageSize;

    await updateSharedSpacesList(options);
  }

  return {
    list,
    loading,
    pagination,
    handlePaginationChange
  };
};
