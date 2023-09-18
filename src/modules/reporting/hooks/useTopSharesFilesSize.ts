import { ref, reactive, watchEffect, computed } from 'vue';
import { getTopSharesByFileSize } from '../services/statistic-api';
import { APIError } from '@/core/types/APIError';
import { message } from 'ant-design-vue';
import { TopSharesFileSizeItem } from '../types/TopSharesFileSize';
import { DEFAULT_PAGE_SIZE } from '@/core/constants/pagination';
import { storeToRefs } from 'pinia';
import { useReportingSharesStore } from '../store';

const loading = ref(false);
const { endDate, beginDate, top, domains } = storeToRefs(useReportingSharesStore());
const list = ref<TopSharesFileSizeItem[]>([]);
const topSharesFileSizePagination = reactive({
  total: 0,
  current: 1,
  pageSize: DEFAULT_PAGE_SIZE,
});
topSharesFileSizePagination.pageSize = 50;

const filteredListByPage = computed(() => {
  const firstIndex = (topSharesFileSizePagination.current - 1) * topSharesFileSizePagination.pageSize;
  const lastIndex = topSharesFileSizePagination.current * topSharesFileSizePagination.pageSize;
  return list.value.slice(firstIndex, lastIndex);
});

async function getSharesByFileSizeInformations() {
  const parameters = {
    domainUuids: [domains.value.map((domainUuids) => domainUuids.uuid)],
    beginDate: beginDate.value?.format('YYYY-MM-DD'),
    endDate: endDate.value?.format('YYYY-MM-DD'),
    page: topSharesFileSizePagination.current - 1,
    size: top.value,
  };
  try {
    loading.value = true;
    const topSharesInformations = await getTopSharesByFileSize(parameters as any);
    list.value = topSharesInformations.list;
    topSharesFileSizePagination.total = topSharesInformations.totalElements;
    loading.value = false;
  } catch (error) {
    if (error instanceof APIError) {
      return message.error(error.getMessage());
    }

    console.warn(error);
  }
}

watchEffect(() => {
  getSharesByFileSizeInformations();
});

export function useTopSharesFilesSize() {
  return {
    loading,
    getSharesByFileSizeInformations,
    filteredListByPage,
    topSharesFileSizePagination,
  };
}
