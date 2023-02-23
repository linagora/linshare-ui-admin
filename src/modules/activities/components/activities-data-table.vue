<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useActivities } from '@/modules/activities/hooks/use-activities';

interface ActivityLogData {
  number: number;
  domainName: string;
  actor: string;
  action: string;
  resourceType: string;
  resourceName: string;
  dateTime: number;
  detail: string;
}
// composable
const { t } = useI18n();
const { fetchActivities, activitiesLogs, loading } = useActivities();

// computed
const activitiesLogsData = computed((): ActivityLogData[] => {
  return activitiesLogs.value.map((item, index) => {
    return {
      number: index + 1,
      domainName: item?.domain?.label || '-',
      actor: item?.actor?.name || t('ACTIVITIES.ME'),
      action: item?.action,
      resourceType: item?.type,
      resourceName: item?.resource?.label || item?.actor?.name || t('ACTIVITIES.ME'),
      dateTime: item?.creationDate,
      detail: item?.message,
    } as ActivityLogData;
  });
});
const columns = computed(() => [
  {
    title: t('ACTIVITIES.NUMBER_COL'),
    width: '100px',
    key: 'number',
    align: 'center',
  },
  {
    title: t('ACTIVITIES.DOMAIN_NAME'),
    key: 'domainName',
    sorter: (a: ActivityLogData, b: ActivityLogData) => a.domainName?.localeCompare(b.domainName),
  },
  {
    title: t('ACTIVITIES.ACTOR'),
    key: 'actor',
    sorter: (a: ActivityLogData, b: ActivityLogData) => a.actor?.localeCompare(b.actor),
  },
  {
    title: t('ACTIVITIES.ACTION'),
    key: 'action',
    sorter: (a: ActivityLogData, b: ActivityLogData) => a.action?.localeCompare(b.action),
  },
  {
    title: t('ACTIVITIES.RESOURCE_TYPE'),
    key: 'resourceType',
    sorter: (a: ActivityLogData, b: ActivityLogData) => a.resourceType?.localeCompare(b.resourceType),
  },
  {
    title: t('ACTIVITIES.RESOURCE_NAME'),
    key: 'resourceName',
    sorter: (a: ActivityLogData, b: ActivityLogData) => a.resourceName?.localeCompare(b.resourceName),
  },
  {
    title: t('ACTIVITIES.DATE_TIME'),
    key: 'dateTime',
    sorter: (a: ActivityLogData, b: ActivityLogData) => a.dateTime - b.dateTime,
  },
  {
    title: t('ACTIVITIES.DETAIL'),
    key: 'detail',
    align: 'center',
  },
]);

// hooks
onMounted(() => {
  fetchActivities();
});
</script>

<template>
  <a-table class="activities-data-table" :data-source="activitiesLogsData" :loading="loading" :columns="columns">
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'number'">
        {{ index + 1 }}
      </template>
      <template v-if="column.key === 'domainName'">
        {{ record.domainName }}
      </template>
      <template v-if="column.key === 'actor'">
        {{ record.actor }}
      </template>
      <template v-if="column.key === 'action'">
        {{ record.action }}
      </template>
      <template v-if="column.key === 'resourceType'">
        {{ record.resourceType }}
      </template>
      <template v-if="column.key === 'resourceName'">
        {{ record.resourceName }}
      </template>
      <template v-if="column.key === 'dateTime'">
        <a-tooltip>
          <template #title>
            {{ $d(record.dateTime, 'mediumDateTime') }}
          </template>
          {{ $d(record.dateTime, 'mediumDate') }}
        </a-tooltip>
      </template>
      <template v-if="column.key === 'detail'"> </template>
    </template>
  </a-table>
</template>

<style lang="less">
.activities-data-table {
  .ant-table {
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    overflow: hidden;
  }
}
</style>
