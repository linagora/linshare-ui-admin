import { ref, reactive, watchEffect, computed } from 'vue';
import { getTopSharesByFileCount } from '../services/statistic-api';
import { APIError } from '@/core/types/APIError';
import { message } from 'ant-design-vue';
import { TopSharesFileCountItem } from '../types/TopSharesFileCount';
import { DEFAULT_PAGE_SIZE } from '@/core/constants/pagination';
import { storeToRefs } from 'pinia';
import { useReportingSharesStore } from '../store';

const loading = ref(false);
const { endDate, beginDate, top, domains } = storeToRefs(useReportingSharesStore());
const list = ref<TopSharesFileCountItem[]>([]);
const topSharesFileCountPagination = reactive({
  total: 0,
  current: 1,
  pageSize: DEFAULT_PAGE_SIZE,
});
topSharesFileCountPagination.pageSize = 50;

const filteredListByPage = computed(() => {
  const firstIndex = (topSharesFileCountPagination.current - 1) * topSharesFileCountPagination.pageSize;
  const lastIndex = topSharesFileCountPagination.current * topSharesFileCountPagination.pageSize;
  return list.value.slice(firstIndex, lastIndex);
});

async function getSharesByFileCountInformations() {
  const parameters = {
    domainUuids: domains.value.map((domainUuids) => domainUuids.uuid),
    beginDate: beginDate.value?.format('YYYY-MM-DD'),
    endDate: endDate.value?.format('YYYY-MM-DD'),
    page: topSharesFileCountPagination.current - 1,
    size: top.value,
  };
  try {
    loading.value = true;
    const topSharesInformations = await getTopSharesByFileCount(parameters as any);
    list.value = topSharesInformations.list;
    topSharesFileCountPagination.total = topSharesInformations.totalElements;
    loading.value = false;
  } catch (error) {
    if (error instanceof APIError) {
      return message.error(error.getMessage());
    }

    console.warn(error);
  }
}

watchEffect(() => {
  getSharesByFileCountInformations();
});

export function useTopSharesFilesCount() {
  return {
    loading,
    getSharesByFileCountInformations,
    filteredListByPage,
    topSharesFileCountPagination,
  };
}
