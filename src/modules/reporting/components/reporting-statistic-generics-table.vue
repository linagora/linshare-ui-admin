<script lang="ts" setup>
import { GenericResourceStatistic } from '../types/GenericStatistic';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineProps<{
  data: GenericResourceStatistic[];
  loading: boolean;
}>();

const { t } = useI18n();
const columns = computed(() => [
  {
    title: t('GENERAL.NUMBER_COL'),
    width: '70px',
    key: 'number',
    align: 'center',
  },
  {
    title: t('REPORTING.GENERICS.RESOURCE_COL'),
    key: 'resource',
    sorter: (a: GenericResourceStatistic, b: GenericResourceStatistic) => a.resource.localeCompare(b.resource),
  },
  {
    title: t('REPORTING.GENERICS.ACTION.CREATE'),
    key: 'CREATE',
    width: '160px',
    sorter: (a: GenericResourceStatistic, b: GenericResourceStatistic) => a.CREATE - b.CREATE,
  },
  {
    title: t('REPORTING.GENERICS.ACTION.DELETE'),
    key: 'DELETE',
    width: '140px',
    sorter: (a: GenericResourceStatistic, b: GenericResourceStatistic) => a.DELETE - b.DELETE,
  },
  {
    title: t('REPORTING.GENERICS.ACTION.DOWNLOAD'),
    key: 'DOWNLOAD',
    width: '240px',
    sorter: (a: GenericResourceStatistic, b: GenericResourceStatistic) => a.DOWNLOAD - b.DOWNLOAD,
  },
  {
    title: t('REPORTING.GENERICS.ACTION.GET'),
    key: 'GET',
    width: '200px',
    sorter: (a: GenericResourceStatistic, b: GenericResourceStatistic) => a.GET - b.GET,
  },
  {
    title: t('REPORTING.GENERICS.ACTION.UPDATE'),
    key: 'UPDATE',
    width: '120px',
    sorter: (a: GenericResourceStatistic, b: GenericResourceStatistic) => a.UPDATE - b.UPDATE,
  },
  {
    title: t('REPORTING.GENERICS.ACTION.SUCCESS'),
    key: 'SUCCESS',
    width: '120px',
    sorter: (a: GenericResourceStatistic, b: GenericResourceStatistic) => a.SUCCESS - b.SUCCESS,
  },
  {
    title: t('REPORTING.GENERICS.ACTION.FAILURE'),
    key: 'FAILURE',
    width: '120px',
    sorter: (a: GenericResourceStatistic, b: GenericResourceStatistic) => a.FAILURE - b.FAILURE,
  },
  {
    title: t('REPORTING.GENERICS.ACTION.PURGE'),
    key: 'PURGE',
    width: '120px',
    sorter: (a: GenericResourceStatistic, b: GenericResourceStatistic) => a.PURGE - b.PURGE,
  },
]);
</script>

<template>
  <a-table class="reporting-statistic-generics-table" :data-source="data" :loading="loading" :columns="columns">
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'number'">
        {{ index + 1 }}
      </template>
      <template v-else-if="column.key === 'resource'">
        {{ $t(`REPORTING.GENERICS.RESOURCE.${record.resource}`) }}
      </template>
      <template v-else-if="column.key === 'CREATE'">
        {{ record.CREATE }}
      </template>
      <template v-else-if="column.key === 'DELETE'">
        {{ record.DELETE }}
      </template>
      <template v-else-if="column.key === 'DOWNLOAD'">
        {{ record.DOWNLOAD }}
      </template>
      <template v-else-if="column.key === 'GET'">
        {{ record.GET }}
      </template>
      <template v-else-if="column.key === 'UPDATE'">
        {{ record.UPDATE }}
      </template>
      <template v-else-if="column.key === 'SUCCESS'">
        {{ record.SUCCESS }}
      </template>
      <template v-else-if="column.key === 'FAILURE'">
        {{ record.FAILURE }}
      </template>
      <template v-else-if="column.key === 'PURGE'">
        {{ record.PURGE }}
      </template>
    </template>
  </a-table>
</template>

<style lang="less">
.reporting-statistic-generics-table {
  .ant-table {
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    overflow-x: auto;
  }
}
</style>
